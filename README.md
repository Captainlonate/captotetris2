# Captotetris

Play it live here: [https://breaks.pirated.technology/](https://breaks.pirated.technology/)


## Summary

This is a blocks-and-breakers style game, built with javascript. I wrote all the code and did all the art. I "found" the sound files online.

## The Code
  * The native HTML `<canvas>` tag and javascript are all I needed to actually build the game
  * `create-react-app` for the simple website which hosts the `<canvas>`, and for the fantastic prebuilt webpack file
  * The bundled files are hosted on AWS (https -> route 53 -> cloudfront -> s3)

## The Art
  * I made all of the 3-D art in Blender, then took 2-D renders of the scenes
  * I assembled the renders into spritesheets for the animations
    * Each animation is 30 frames, and I used TexturePacker to neatly organize the 30 .pngs into a single sprite sheet

## To Run it
  1. Clone the repo
  2. `npm install` within the directory
  3. `npm start`

## To tinker with the original art files
  1. Go get [Blender](https://www.blender.org/).
  2. Run Blender, click "Open..." and navigate to `/src/images/blender/<one of the folders>/<one of the .blend files>`
  3. It will look something like this:
  ![Blender Example](readme_images/blender_example.png)

## Some Images

<table>
  <tbody>
  <tr>
    <td><img src="readme_images/progress_3_19.png" width="256" height="300" /></td>
    <td></td>
    </tr>
    <tr>
    <td>
      <img src="readme_images/green_breaker.gif" width="300" height="300" />
    </td>
    <td>
      <img src="readme_images/green_block.png" width="300" height="300" />
    </td>
    </tr>
    <tr>
    <td>
      <img src="readme_images/blue_breaker.png" width="300" height="300" />
    </td>
    <td>
      <img src="readme_images/blue_block.png" width="300" height="300" />
    </td>
    </tr>
    <tr>
    <td>
      <img src="readme_images/red_breaker_loses_eye_compressed.gif" width="300" height="300" />
    </td>
    <td>
      <img src="readme_images/red_block.png" width="300" height="300" />
    </td>
    </tr>
    <tr>
    <td>
      <img src="readme_images/yellow_breaker.png" width="300" height="300" />
    </td>
    <td>
      <img src="readme_images/yellow_block.png" width="300" height="300" />
    </td>
    </tr>
    <tr>
  </tbody>
</table>