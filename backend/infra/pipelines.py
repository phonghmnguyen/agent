from typing import Callable, Dict, Any, Optional, Sequence
from dataclasses import dataclass
from enum import Enum

from haystack import Pipeline, Document, component
from haystack.document_stores.types import DuplicatePolicy
from haystack.components.writers import DocumentWriter
from haystack.components.embedders import OpenAIDocumentEmbedder
from haystack.components.preprocessors.document_splitter import DocumentSplitter
from haystack_integrations.document_stores.mongodb_atlas import MongoDBAtlasDocumentStore
from haystack.components.builders.prompt_builder import PromptBuilder
from haystack.dataclasses.streaming_chunk import StreamingChunk
from haystack.components.generators.chat import OpenAIChatGenerator
from haystack.components.embedders import OpenAITextEmbedder
from haystack.components.joiners import DocumentJoiner
from haystack_integrations.components.retrievers.mongodb_atlas import MongoDBAtlasEmbeddingRetriever
from haystack_integrations.components.rankers.cohere import CohereRanker
from haystack_integrations.document_stores.mongodb_atlas import MongoDBAtlasDocumentStore


@component
class MongoDBAtlasBM25Retriever:
    mongodb_store: MongoDBAtlasDocumentStore

    def __init__(self, document_store: MongoDBAtlasDocumentStore):
        self.mongodb_store = document_store

    @component.output_types(documents=Sequence[Document])
    def run(self, query: str):

        test = [{
            "id": "0",
            "text": "hi",
            "score": 9,
        }]
        return {"documents": [Document(id=doc.id, content=doc.text, score=doc.score) for doc in test]}


class SplitType(Enum):
    WORD = "word"
    SENTENCE = "sentence"
    PAGE = "page"
    PASSAGE = "passage"


@dataclass
class MongoDBIndexingConfig:
    mongodb_store: MongoDBAtlasDocumentStore
    duplication_policy: DuplicatePolicy = DuplicatePolicy.OVERWRITE
    split_type: SplitType = SplitType.WORD
    chunk_size: int = 512
    chunk_overlap: int = 32


class MongoDBIndexingPipeline(Pipeline):
    config: MongoDBIndexingConfig
    mongodb_store: MongoDBAtlasDocumentStore
    doc_splitter: DocumentSplitter
    doc_writer: DocumentWriter
    doc_embedder: OpenAIDocumentEmbedder

    def __init__(self, config: MongoDBIndexingConfig) -> None:
        super().__init__()
        self.config = config
        self.mongodb_store = config.mongodb_store
        self.doc_splitter = DocumentSplitter(
            split_by=config.split_type,
            split_length=config.chunk_size,
            split_overlap=config.chunk_overlap
        )
        self.doc_embedder = OpenAIDocumentEmbedder(
            model="text-embedding-3-small")
        self.doc_writer = DocumentWriter(
            document_store=config.mongodb_store, policy=config.duplication_policy)
        self._build_pipeline()

    def _build_pipeline(self) -> None:
        self.add_component(instance=self.doc_splitter, name="doc_splitter")
        self.add_component(instance=self.doc_embeder,
                           name="openai_doc_embedder")
        self.add_component(instance=self.doc_writer, name="mongodb_doc_writer")
        self.connect(sender="doc_splitter", receiver="openai_doc_embedder")
        self.connect(sender="openai_doc_embedder",
                     receiver="mongodb_doc_writer")

    def batch_upload_docs(self, docs: Sequence[Document]) -> Dict[str, Any]:
        return self.run({"doc_splitter": {"documents": docs}})


@dataclass
class MongoDBHybridRetrievalConfig:
    mongodb_store: MongoDBAtlasDocumentStore
    streaming: bool
    streaming_func: Optional[Callable[[StreamingChunk], None]]


class MongoDBHybridRetrievalPipeline(Pipeline):
    config: MongoDBHybridRetrievalConfig
    mongodb_store: MongoDBAtlasDocumentStore
    text_embedder: OpenAITextEmbedder
    embedding_retriever: MongoDBAtlasEmbeddingRetriever
    mb25_retriever: MongoDBAtlasBM25Retriever
    doc_joiner: DocumentJoiner
    ranker: CohereRanker
    prompt_builder: PromptBuilder

    def __init__(self, config: MongoDBHybridRetrievalConfig) -> None:
        super().__init__()
        self.config = config
        self.mongodb_store = config.mongodb_store
        self.text_embedder = OpenAITextEmbedder(
            model="text-embedding-3-small")
        self.embedding_retriever = MongoDBAtlasEmbeddingRetriever(
            document_store=config.mongodb_store)
        self.mb25_retriever = MongoDBAtlasBM25Retriever(
            document_store=config.mongodb_store)
        self.doc_joiner = DocumentJoiner()
        self.cross_encoder_ranker = CohereRanker(
            model="rerank-english-v2.0", top_k=5)
        self.prompt_builder = PromptBuilder(template="""
                Given these documents, answer the question.\nDocuments:
            {% for doc in documents %}
                {{ doc.content }}
            {% endfor %}

            \nQuestion: {{query}}
            \nAnswer:
            """)
        self.llm = OpenAIChatGenerator(
            model="gpt-4o", streaming_callback=config.streaming_func
            if config.streaming and config.streaming_func else None)
        self._build_pipeline()

    def _build_pipeline(self) -> None:
        self.add_component(instance=self.text_embedder, name="text_embedder")
        self.add_component(instance=self.embedding_retriever,
                           name="embedding_retriever")
        self.add_component(instance=self.mb25_retriever,
                           name="mb25_retriever")
        self.add_component(instance=self.doc_joiner, name="doc_joiner")
        self.add_component(instance=self.cross_encoder_ranker,
                           name="cross_encoder_ranker")
        self.add_component(instance=PromptBuilder, name="prompt_builder")
        self.add_component(instance=self.llm, name="llm")
        self.connect("text_embedder", "embedding_retriever")
        self.connect("mb25_retriever", "doc_joiner")
        self.connect("embedding_retriever", "doc_joiner")
        self.connect("doc_joiner", "cross_encoder_ranker")
        self.connect("cross_encoder_ranker", "prompt_builder.documents")
        self.connect("prompt_builder", "llm")

    def query(self, query: str) -> Dict[str, Any]:
        return self.run(
            {
                "text_embedder": {"text": query},
                "mb25_retriever": {"query": query},
                "prompt_builder": {"query": query},
            }
        )
