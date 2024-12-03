from haystack import Pipeline
from haystack_integrations.document_stores.mongodb_atlas import MongoDBAtlasDocumentStore
from haystack.components.builders import PromptBuilder
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
            model="text-embedding-3-small",
        )
        self.embedding_retriever = MongoDBAtlasEmbeddingRetriever(
            document_store=self.mongodb_store, top_k=4)
        self._build_pipeline()

    def _build_pipeline(self) -> None:
        self.add_component(instance=self.text_embedder, name="text_embedder")
        self.add_component(instance=self.embedding_retriever,
                           name="embedding_retriever")
        self.connect("text_embedder.embedding", "embedding_retriever.query_embedding")

    def query(self, query: str) -> list[dict]:
        docs = self.run(
            {
                "text_embedder": {"text": query},
            }
        )["embedding_retriever"]["documents"]
        return [doc.content for doc in docs]
