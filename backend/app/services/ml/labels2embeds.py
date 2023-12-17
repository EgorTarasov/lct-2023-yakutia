from .vectorizer import vectorize

from typing import Dict, List, Any


def get_labels_embeds(
    tokenizer,
    sbert,
    classes: List[Dict[str, str | int]],
) -> Dict[str, Dict[str, Any]]:
    labels = {}
    for label in classes:
        name = label["name"]
        text = str(label["description"])
        embedding = vectorize(tokenizer, sbert, text)
        labels[name] = {"description": text, "embedding": embedding}
    # TODO: save vectors for groups in database
    print("l", type(labels["Инженер по обслуживанию автотранспорта"]["embedding"]))

    return labels
