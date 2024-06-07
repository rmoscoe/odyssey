import google.generativeai as gemini
from google.generativeai.types import HarmCategory, HarmBlockThreshold
import os
import json

def generate_adventure(game, players, scenes, encounters, plot_twists, clues, homebrew_description=None, campaign_setting=None, level=None, experience=None, context=None):
    api_key = os.environ.get('API_KEY')
    null_plot_twists = 100 - plot_twists
    null_clues = 100 - clues

    gemini.configure(api_key=api_key)
    model = gemini.GenerativeModel(model_name="gemini-1.5-flash")

    config = {
        "temperature": 0.95,
        "candidate_count": 1,
        "top_k": 10000,
        "top_p": 0.95,
        "max_output_tokens": 1024,
        "stop_sequences": [],
    }
    safety_settings={
        HarmCategory.HARM_CATEGORY_HATE_SPEECH: HarmBlockThreshold.BLOCK_LOW_AND_ABOVE,
        HarmCategory.HARM_CATEGORY_HARASSMENT: HarmBlockThreshold.BLOCK_LOW_AND_ABOVE,
        HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
        HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT: HarmBlockThreshold.BLOCK_ONLY_HIGH,
        HarmCategory.HARM_CATEGORY_HARASSMENT: HarmBlockThreshold.BLOCK_LOW_AND_ABOVE
    }
    prompt = f"""Write an adventure for the {game} roleplaying game, """
    
    if campaign_setting is not None:
        prompt += f"""{campaign_setting} campaign setting, """
    
    prompt += f"""for {players} players"""

    if level is not None:
        prompt += f""" at level {level}. The difficulty of the adventure should be appropriate to the number of players and their level"""
    
    if experience is not None:
        prompt += f""" with {experience} experience points. The difficulty of the adventure should be appropriate to the number of players and their experience"""

    prompt += ". "
    
    if homebrew_description is not None:
        prompt += f"""The following is a description of {game}, a homebrew roleplaying game:
        {homebrew_description}
        """

    prompt += f"""The rising action should include {scenes} scenes. Each encounter is a trap, enemies, a puzzle (in which case, describe the solution), or some other obstacle. Respond in JSON using the following format:
    {{
        Exposition: "Background knowledge the players might possess, if any, or prologue. Use between 0 and 250 characters for the exposition.",
        Incitement: "The event that directly involves the players and starts the adventure",
        "Rising Action": [scene: {{
          challenge: "something the players must accomplish to get one step closer to their goal", 
          setting: "where the scene takes place, which should be more specific than the name of a city", 
          encounters: [
            {{
              type: "type", 
              description: "something or someone that stands in their way, which could be a trap, a puzzle, an enemy or enemies, or a combination thereof"
            }}
          ], 
          "plot twist": "An event or discovery that changes something the players believed to be true", 
          clue : "a hint about what the players should do next or information that brings the players closer to completing the overall adventure"
        }}],
        Climax: "The final and most difficult scene that determines whether the players complete the adventure",
        Denoument: "Epilogue or rewards the players can expect if successful"
    }}

    Each scene has a challenge and an array of encounters. Each array of encounters includes a different random number of encounters, between 1 and {encounters} (inclusive). Also, {null_plot_twists}% of plot twists are null and {null_clues}% of clues are null. For example, one scene may have 3 encounters, a plot twist, and a null clue. Another scene may have 1 encounter, a null plot twist, and a clue.
    
    Each clue should be related to the scene's setting or an encounter. EXAMPLE 1: challenge: track down a bad guy. setting: the bad guys' office with a computer. clue: The computer shows the bad guy's calendar, which has an appointment tomorrow at 9:00 a.m. in a nearby park. EXAMPLE 2: challenge: deactivate the security cameras in the starbase. setting: the security chief's office. encounters: [enemy: the security chief]. clue: If subdued and interrogated, the security chief can provide the access code to deactivate the security cameras. EXAMPLE 3: encounters: [enemies: 2 bugbears, trap: swinging log trap]. clue: the bugbears know how to disarm the swinging log trap."""

    if context is not None:
        prompt += "\n" + context

    redo = True

    try:
        while redo:
            response = model.generate_content(
                prompt,
                generation_config=config,
                safety_settings=safety_settings
            )
            adventure = json.loads(response.text.strip()[7:-3])
            if len(adventure["Exposition"]) < 500:
                redo = False
                return response.result
    except Exception as e:
        print(e)
        raise e

