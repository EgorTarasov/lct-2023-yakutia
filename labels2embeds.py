import torch
from typing import Dict, List, Any

def get_labels_embeds(classes: List[Dict[str, str | int]]
                      ) -> Dict[str, Dict[str, Any]]:
    labels = {}
    for label in classes:
        name = label["name"]
        text = label["description"]
        embedding = torch.Tensor([label["embeddings"]])
        labels[name] = {"description": text,
                        "embeddings": embedding}
    return labels
