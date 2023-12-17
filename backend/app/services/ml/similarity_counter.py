from sklearn.metrics.pairwise import cosine_similarity
from typing import Dict, Any

def get_score(embedding, labels: Dict[str, Dict[str, Any]]) -> Dict[str, float]:
    scores = {}
    for name, value in labels.items():
        label_embedding = labels[name]["embeddings"]
        similarity = cosine_similarity(embedding, label_embedding)[0][0]
        scores[name] = similarity
    return scores
