import json
from typing import List, Dict

from vectorizer import vectorize
from similarity_counter import get_score
from labels2embeds import get_labels_embeds

def get_predict(group_scores: List[Dict[str, float]],
                threshold: float = 0.5) -> List[str]:
    pred_dict = {}
    for group_pred in group_scores:
        for name, similarity in group_pred.values():
            if name not in pred_dict:
                pred_dict[name] = 0
            if similarity > threshold:
                pred_dict[name] += similarity
    pred = sorted(pred_dict, key=lambda x: -1 * pred_dict[x])
    return pred


def inference(request: Dict[str, str | List[float]],
              classes: List[Dict[str, str | int]]):
    
    labels_embeddings = get_labels_embeds(classes)
    groups_list = list(request.keys())

    user_scores = []
    ml_response = {}
    for group_name in groups_list:
        group_info = request[group_name]
        if "predict" in group_info:
            user_scores.append(group_info["predict"])
        else:
            group_text = request[group_name]["desctription"]
            group_embedding = vectorize(group_text)
            group_score = get_score(group_embedding, labels_embeddings)
            user_scores.append(group_score)
            ml_response[group_name] = {"desctription": group_text,
                                       "predict":group_score} 

    pred = get_predict(user_scores) # сделать

    return pred, ml_response
    

