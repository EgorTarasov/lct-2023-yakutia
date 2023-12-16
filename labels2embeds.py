from vectorizer import vectorize

from typing import Dict, List, Any

def get_labels_embeds(classes: List[Dict[str, str | int]]
                      ) -> Dict[str, Dict[str, Any]]:
    labels = {}
    for label in classes:
        name = label["name"]
        text = label["description"]
        embedding = vectorize(text)
        labels[name] = {"description": text,
                        "embedding": embedding}
    return labels