# 29C 3B:

import asyncio
from frame_sdk import Frame

main_lua = """
function change_text()
     frame.display.clear()
     frame.display.text('Frame tapped!', 50, 100)
     frame.display.show()
 end

 frame.imu.tap_callback(change_text)
 frame.display.clear()
 frame.display.text('Tap the side of Frame', 50, 100)
 frame.display.show()
 """


async def main():
    # the with statement handles the connection and disconnection to Frame
    async with Frame() as frame:
        print("connected")
        # f is a connected Frame device, so you can call await f.<whatever>
        # for example, let's get the current battery level
        await frame.run_lua(main_lua)

    # outside of the with statement, the connection is automatically closed
    print("disconnected")


# make sure you run it asynchronously
asyncio.run(main())
