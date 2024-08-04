# 29C 3B:

import asyncio
from frame_sdk import Frame


async def main():
    # the with statement handles the connection and disconnection to Frame
    async with Frame() as frame:
        print("connected")
        # f is a connected Frame device, so you can call await f.<whatever>
        # for example, let's get the current battery level
        print(f"Frame battery: {await frame.get_battery_level()}%")

    # outside of the with statement, the connection is automatically closed
    print("disconnected")


# make sure you run it asynchronously
asyncio.run(main())
