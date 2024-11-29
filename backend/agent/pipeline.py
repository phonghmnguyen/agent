from typing import Dict, Any

from haystack import Pipeline
from haystack_integrations.document_stores.mongodb_atlas import MongoDBAtlasDocumentStore
from haystack.components.builders.prompt_builder import PromptBuilder
from haystack.components.generators.chat import OpenAIChatGenerator
from haystack.components.embedders import OpenAITextEmbedder
from haystack_integrations.components.retrievers.mongodb_atlas import MongoDBAtlasEmbeddingRetriever
from haystack_integrations.document_stores.mongodb_atlas import MongoDBAtlasDocumentStore


class MongoDBRetrievalPipeline(Pipeline):
    mongodb_store: MongoDBAtlasDocumentStore
    text_embedder: OpenAITextEmbedder
    embedding_retriever: MongoDBAtlasEmbeddingRetriever
    prompt_builder: PromptBuilder

    def __init__(self, store: MongoDBAtlasDocumentStore) -> None:
        super().__init__()
        self.mongodb_store = store
        self.text_embedder = OpenAITextEmbedder(
            model="text-embedding-3-small")
        self.embedding_retriever = MongoDBAtlasEmbeddingRetriever(
            document_store=self.mongodb_store)
        self.prompt_builder = PromptBuilder(template="""
                Given these documents, answer the question.\nDocuments:
            {% for doc in documents %}
                {{ doc.content }}
            {% endfor %}

            \nQuestion: {{query}}
            \nAnswer:
            """)
        self.llm = OpenAIChatGenerator(
            model="gpt-4o")
        self._build_pipeline()

    def _build_pipeline(self) -> None:
        self.add_component(instance=self.text_embedder, name="text_embedder")
        self.add_component(instance=self.embedding_retriever,
                           name="embedding_retriever")
        self.add_component(instance=self.prompt_builder, name="prompt_builder")
        self.add_component(instance=self.llm, name="llm")
        self.connect("text_embedder", "embedding_retriever")
        self.connect("embedding_retriever", "prompt_builder.documents")
        self.connect("prompt_builder", "llm")

    def query(self, query: str) -> Dict[str, Any]:
        return self.run(
            {
                "text_embedder": {"text": query},
                "prompt_builder": {"query": query},
            }
        )
