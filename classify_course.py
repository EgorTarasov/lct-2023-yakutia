import pandas as pd
import torch
from sklearn.metrics.pairwise import cosine_similarity

from vectorizer import vectorize

def get_classes(path_to_csv: str,
                professions: list[dict[str, str | int]],
                threshold: float = 0.55):
    df = pd.read_csv(path_to_csv, on_bad_lines='skip', delimiter=";")
    df["text"] = df.apply(lambda x: x["name"] + ". " + x["portfolioText"] if type(x["portfolioText"]) != float else x["name"], axis=1)
    result = []

    for course_id in df["id"]:
        row = {}
        for col_name in df[df["id"] == course_id]:
            if col_name != "text":
                row[col_name] = df[df["id"] == course_id][col_name].item()
            else:
                course_embedding = torch.Tensor([vectorize(df[df["id"] == course_id]["text"].item())])
                curr_res = []
                curr_scores = []
                for profession in professions:
                    name = profession["name"]
                    description = profession["description"]
                    profession_embedding = torch.Tensor([vectorize(description)])
                    score = cosine_similarity(course_embedding, profession_embedding)
                    if score > threshold:
                        curr_res.append(name)
                        curr_scores.append(score)
                row["professionsNames"] = [x for _, x in sorted(zip(curr_scores, curr_res))]
        result.append(row)
    return result
