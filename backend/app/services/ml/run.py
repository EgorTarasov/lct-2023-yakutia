import time
import logging
from typing import List, Dict

from .vectorizer import vectorize
from .similarity_counter import get_score
from .labels2embeds import get_labels_embeds


def get_predict(
    group_scores: List[Dict[str, float]], threshold: float = 0.5
) -> List[str]:
    # pred_dict = {}
    for group_pred in group_scores:
        for name, similarity in group_pred.values():
            if name not in pred_dict:
                pred_dict[name] = 0
            if similarity > threshold:
                pred_dict[name] += similarity
    pred = sorted(pred_dict, key=lambda x: -1 * pred_dict[x])
    return pred


def inference(
    tokenizer,
    sbert,
    request: Dict[str, str | List[float]],
    classes: List[Dict[str, str | int]],
):  # -> tuple[List[str], dict[Any, Any]]:
    #

    start = time.perf_counter()
    labels_embeddings = get_labels_embeds(tokenizer, sbert, classes)
    logging.info(f"generated labels embeds in: {time.perf_counter() - start}")
    #
    groups_list = list(request.keys())

    user_scores = []
    ml_response = {}
    for group_name in groups_list:
        group_info = request[group_name]
        if "predict" in group_info:
            user_scores.append(group_info["predict"])
        else:
            start = time.perf_counter()
            group_text = request[group_name]["description"]
            group_embedding = vectorize(tokenizer, sbert, group_text)
            logging.info(f"vectorized embeding in {time.perf_counter() - start}")
            start = time.perf_counter()
            group_score = get_score(group_embedding, labels_embeddings)
            user_scores.append(group_score)
            ml_response[group_name] = {
                "description": group_text,
                "predict": group_score,
            }

    pred = get_predict(user_scores)  # сделать

    return pred, ml_response
