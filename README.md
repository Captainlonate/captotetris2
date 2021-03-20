# Captotetris

Play it live here: [https://breaks.pirated.technology/](https://breaks.pirated.technology/)


## Summary

This is a blocks-and-breakers style game built with javascript. I wrote all the code and did all the art.

_`If you see it, I built it. If you hear it, I stole it`_ : )

Learn about:

  1. [The Code](#the-code)
  2. [The Art](#the-art)

![red_breaker_loses_eye](readme_images/red_breaker_loses_eye.mp4)

<img src="readme_images/progress_3_19" width="1627" height="1905" />

## The Code
  * The native HTML `<canvas>` tag and javascript are all I needed to actually build the game
  * `create-react-app` for the simple website which hosts the `<canvas>`, and for the fantastic prebuilt webpack file
  * The bundled files are hosted on AWS (https -> route 53 -> cloudfront -> s3)


## The Art
  * I made all of the 3-D art in Blender, then took 2-D renders of the scenes
  * I assembled the renders into spritesheets for the animations
    * Each animation is 30 frames, and I used TexturePacker to neatly organize the 30 .pngs into a single sprite sheet

## The project
Everything needed to run the project can be found within this GitHub repo.

### To Run it
  1. Clone the repo
  2. `npm install` within the directory
  3. `npm start`

### To tinker with the original art files
  1. Go get [Blender](https://www.blender.org/).
  2. Run Blender, click "Open..." and navigate to `/src/images/blender/<one of the folders>/<one of the .blend files>`
  
