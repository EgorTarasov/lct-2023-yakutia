from sklearn.metrics.pairwise import cosine_similarity
from typing import List, Dict, Any

def get_score(embedding, labels: Dict[str, Dict[str, Any]]) -> Dict[str, float]:
    scores = {}
    for name, value in labels.items():
        label_embedding = labels[name]["embedding"]
        similarity = cosine_similarity(embedding, label_embedding)
        scores[name] = similarity
    return scores