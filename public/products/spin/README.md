# Turntable frames — photography brief

Drop the finished frames in this folder, named `001.png`, `002.png` … in
rotation order. The site picks them up on the next build and the hero switches
from the drawn still to the real bottle spinning. Nothing else needs changing.

Delete this file once the frames are in.

---

## What to shoot

A single bottle photographed once per rotation step, all the way around.

| | |
| --- | --- |
| **Frames** | **36** (10° apart, very smooth) — or 24 (15°, still good, lighter page) |
| **Direction** | Rotate the bottle clockwise viewed from above, consistently |
| **Output** | Square, all frames identical dimensions, **1600×1600px or larger** |
| **Format** | PNG on a transparent background is ideal. JPG on pure white also works |
| **Naming** | `001.png` … `036.png` — zero-padded to three digits, in rotation order |

## How to shoot it

**Camera fixed, product turning.** Camera on a tripod, bottle on a turntable
(a cheap manual lazy susan is fine). Never move the camera between frames.

**Mark the rotation.** Tape a paper protractor under the turntable, or use a
motorised one. Even steps matter more than exact ones — an uneven step shows up
as a stutter.

**Lock everything on the camera.** This is the step people skip and it ruins
the sequence:

- Manual exposure — no aperture priority, no auto ISO
- Manual white balance — not auto
- Manual focus — lock it once on the label and don't touch it
- Fixed focal length — no zooming between frames

Anything on automatic will drift slightly frame to frame, and the spin will
flicker in brightness or colour.

**Lights don't move.** Two soft sources, one key one fill, both fixed to the
room, not to the turntable. If a light turns with the bottle, the highlight
stops travelling across it and the spin stops reading as 3D.

**Keep the bottle centred** on the turntable's axis. If it's off-centre it will
wobble across the frame as it turns, which looks like a mistake rather than a
rotation.

**Keep the label legible.** Start frame `001` with the label square to camera,
so the first thing a visitor sees is the front of the bottle.

## After the shoot

- Crop every frame identically. Batch-crop to one square selection; do not
  reframe individually.
- Apply the same edit to all frames at once, never frame by frame.
- If cutting out the background, use the same mask across the set. A mask that
  varies per frame makes the edges crawl.
- Export at the same pixel dimensions, sequentially numbered.

## Checking it worked

Flip through the exported frames quickly in a folder preview. If the bottle
appears to sit still and only rotate, it's right. If it jumps, drifts, or
flickers in brightness, that frame needs redoing — one bad frame is visible
every single rotation.
