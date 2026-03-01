Base Tier (150-200 words)

Answer these questions in your own words:

    What did you build? Describe the feature in plain language.
    I built a feature that allowed users to change the color of the of the To Do list. The user can change colors by using a color picker and can save colors they liked. Users can also reset the color to the standard background. 

    How did micro-iteration feel? Was working in small steps natural or frustrating? Why?
    The micro-iteration allows me to double check what Claude is planning on doing before fully changing the code. While a bit tedious, i feel that it is important to do all this to make sure that Claude isn't changing the code in a way that you wouldn't want it to. 

    What did self-review catch? When you asked the AI to review its own code, what issues did it find? Give at least one specific example.
    When Claude did the self-review, it said it would add a small 'reset' button if people liked the original gradient instead of a solid color they can pick from. There were no bug or anything else. 

    Tool impressions. What did you like or dislike about [Copilot Agent / Claude Web]? 
    Claude is easy to understand and can understand what my needs are when it comes to using it in my code. One thing I find frustrating is that sometimes, it takes a few tries to get thing how I want it to be. While expected, it is tedious and sometimes, it doesn't work in the end.  

    Self-review patterns. Did the AI consistently catch certain types of issues during self-review (e.g., edge cases, missing error handling)? Did it ever miss something you caught yourself?
    The AI did find one minor edge case. It states that the default gradient "only matches the start of the gradient, not the full background...the color swatch won't perfectly represent the current background — but it's the closest we can get since color inputs don't support gradients. This is fine as-is." Besides that, so far I haven't found any major issues myself. Everything has been pretty smooth luckily.

    Browser tool vs. CLI comparison. If you’ve used Claude Code CLI or another terminal tool, how did the browser-based experience compare? What’s better/worse about each?
    To be frank, I am not a big fan of the terminal tool. It was much easier to work on the Claude windown on the side of VS code. It is much more convienent in comparison to the terminal. 

    When would you use micro-iteration + self-review? For what kinds of tasks does this workflow make sense? When would you skip it?
    If you are doing more complex coding in CLaude. The micro-interation and self-review would allow users to check to see what the AI is doing and how it plans on changing your code. AI can sometimes drastically change code in ways the users wouldn't like it to. Especially if the AI ends up breaking the code. I would skip it for more simple tasks like changing styles or adding buttons. 

