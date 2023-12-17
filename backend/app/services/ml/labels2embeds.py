import torch
from typing import Dict, List, Any


def get_labels_embeds(
    classes: list[dict[str, str | int]]
) -> dict[str | int, dict[str, Any]]:
    labels = {}
    for label in classes:
        name = label["name"]
        text = label["description"]
        embedding = torch.Tensor([label["embeddings"]])
        labels[name] = {"description": text, "embeddings": embedding}
    return labels
