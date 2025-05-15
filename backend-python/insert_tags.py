import uuid
from db_connection import get_db_connection

tags = [
    "House",
    "Deep House",
    "Progressive House",
    "Funky House",
    "Acid House",
    "Tech House",
    "Minimal House",
    "Tropical House",
    "Bass House",
    "Deep Tech House",
    "Jackin House",
    "Soulful House",
    "Techno",
    "Detroit Techno",
    "Berlin Techno",
    "Acid Techno",
    "Industrial Techno",
    "Minimal Techno",
    "Hard Techno",
    "Melodic Techno",
    "Peak Time Techno",
    "Schranz",
    "Trance",
    "Progressive Trance",
    "Psytrance",
    "Farofa trance",
    "Goa Trance",
    "Tech Trance",
    "Hard Trance",
    "Dark Psy",
    "Full On Psytrance",
    "Full on Morning Psytrance",
    "Full on Night Psytrance",
    "Zenonesque",
    "Forest psy",
    "Hitech",
    "Psycore",
    "Drum and Bass",
    "Liquid Drum and Bass",
    "Jump Up",
    "Neurofunk",
    "Darkstep",
    "Techstep",
    "Ragga Jungle",
    "Atmospheric Drum and Bass",
    "Halftime",
    "Rollers",
    "Dubstep Brostep",
    "Riddim",
    "Deep Dubstep",
    "Trapstep",
    "Hybrid Trap",
    "Deathstep",
    "Glitchstep",
    "Hardcore",
    "Happy Hardcore",
    "Gabber",
    "Frenchcore",
    "Speedcore",
    "Terrorcore",
    "UK Hardcore",
    "Crossbreed",
    "Industrial Hardcore",
    "Electro",
    "Electro House",
    "Electroclash",
    "Electro Funk",
    "Dark Electro",
    "Italo Electro",
    "Bass Electro",
    "Retro Electro",
    "experimentaçoes",
    "Vaporwave",
    "Synthwave",
    "Future Bass",
    "Lo Fi Hip Hop",
    "Downtempo",
    "Chillstep",
    "Chillwave",
    "Future Garage",
    "Glitch Hop"
]

def insert_tags():
    connection = get_db_connection()
    cursor = connection.cursor()
    for tag in tags:
        tag_nome = tag.replace("-", "").replace("  ", " ").strip()
        tag_id = str(uuid.uuid4())
        cursor.execute(
            "INSERT INTO tag (id, nome, eh_predefinida) VALUES (%s, %s, %s)",
            (tag_id, tag_nome, True)
        )
    connection.commit()
    cursor.close()
    connection.close()
    print(f"{len(tags)} tags inseridas com sucesso.")

if __name__ == "__main__":
    insert_tags()
