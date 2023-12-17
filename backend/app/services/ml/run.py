import json
from typing import List, Dict
import torch
import time
import logging

from .similarity_counter import get_score
from .labels2embeds import get_labels_embeds


def get_predict(group_scores, threshold: float = 0.7):
    pred_dict = {}
    for group_pred in group_scores:
        for name, similarity in group_pred.items():
            if name not in pred_dict:
                pred_dict[name] = 0
            if similarity > threshold:
                pred_dict[name] += similarity
    pred = sorted(pred_dict, key=lambda x: -1 * pred_dict[x])
    return pred


def inference(
    request: Dict[str, str | List[float]], classes: List[Dict[str, str | int]]
):  # -> dict[Any, Any]:
    start = time.perf_counter()
    labels_embeddings = get_labels_embeds(classes)
    groups_list = list(request.keys())

    user_scores = [
        get_score(
            torch.Tensor([request[group_name]["embeddings"]]),
            labels_embeddings,
        )
        for group_name in groups_list
    ]

    pred = get_predict(user_scores)
    logging.info(f"got result in {time.perf_counter() - start}")
    return pred
