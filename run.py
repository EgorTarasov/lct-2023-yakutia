import json
from typing import List, Dict
import torch

from similarity_counter import get_score
from labels2embeds import get_labels_embeds


def get_predict(group_scores,
                threshold: float = 0.6):
    pred_dict = {}
    for group_pred in group_scores:
        for name, similarity in group_pred.items():
            if name not in pred_dict:
                pred_dict[name] = 0
            if similarity > threshold:
                pred_dict[name] += similarity
    pred = sorted(pred_dict, key=lambda x: -1 * pred_dict[x])
    return pred


def inference(request: Dict[str, str | List[float]],
              classes: List[Dict[str, str | int]]) -> List[str]:

    labels_embeddings = get_labels_embeds(classes)
    groups_list = list(request.keys())

    user_scores = []
    ml_response = {}
    for group_name in groups_list:
        group_text = request[group_name]["description"]
        group_embedding = torch.Tensor([request[group_name]["embeddings"]])
        group_score = get_score(group_embedding, labels_embeddings)
        user_scores.append(group_score)

    pred = get_predict(user_scores)
    return pred
