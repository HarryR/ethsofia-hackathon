# IExec Feedback

Over at least 24 hours, we've been trying to get an AI model deployed inside iExec for the hackaton, using a variety of strategies, with none of them working out, as described in https://github.com/HarryR/ethsofia-hackathon/blob/main/packages/backend/README.md. As such, I believe me and my team are in a good position to give feedback to iExec concerning the documentation and execution of the project.

## Documentation

Documentation was generally good. It explained all the neccessary steps in sufficient detail to proceed. One critique I have of the protocol documentation is that it was not the most _comprehensive_, information-filled source of information available - a separate, unlinked Github repository, https://github.com/iExecBlockchainComputing/documentation/, had more information on details like e.g. building Gramine apps. In this case, having a note on the documentation that Gramine used to work but doesn't work today would have saved me half an hour of trying.

In addition, a page on the documentation which explain the various worker pools and their respective limitations would have been nice.

Also, do callback push results really require RLC to work? Seems odd with all the zero-gas elsewhere.

## Developer tools

The `iexec` CLI feels good to use, especially once one gets used to it. I don't get the purpose of having it output files in the current working directory, however; this tended to just swamp me with many .json files. Suggestion: either use a `.iexec/` folder for all files except `iexec.json`, get all of them into one single file, or have it all cached files stored in a global location like `$XDG_CONFIG_HOME/iexec` and split `iexec.json` into multiple `.yml` files ala Kubernetes.

~~Idapp, the unfinished CLI can be replaced by a bash script that works times better, see https://github.com/HarryR/ethsofia-hackathon/blob/main/packages/backend/node-mocked/build.sh.~~

## iExec SDK

I did not personally use the SDK, but my teammate who did seemed to have no problem in using DataProtectCore using the JS APIs. There were some minor mishaps around `await`-s and processing data, but those were mostly on us.

One point of feedback here is that the DataProtect SDK asks the wallet to sign unscrutinable binary data, which can be offputting for security-minded users.

## iExec Core

We didn't use the Core parts of iExec directly, only interacted with them through the CLIs and SDKs. However, something we all noticed is that iExec is quite quite slow, especially for our usecase of offloading computation from the browser. It took us somewhere around a minute just to get a task executed (and another minute if we wanted to use dataprotect datasets for it); and when the task itself took in the vicinity of seconds, it the latency added by the blockchain drawfed the runtime.

## Bellecor

No gas fees feels great! No tokens and faucets to manage, everything just works. However, we do think you have at least one Denial of Service ~~problem~~ opportunity. For example, someone could easily swamp the worker pool with tasks. Or maybe, create a task which starts two instances of itself, for a fork bomb-like attack which takes the network down. Or, in a similar vein, upload many large secrets to SMS from a bunch of generated addresses, to starve it from storage space. We would love offer our services with stress-testing if you don't believe there are DoS opportunities in iExec.

## Sconify iExec

We couldn't get Sconify iExec working, even with one senior developer teammember dedicated to getting that working during the Hackaton. Whitelisting requirements, cryptic errors, slow builds, odd requirements, it's not very user-friendly to use.

## Overall (unedited)

Generally: features are a bit lacking. For developers to be able to create cool and amazing things on top of iExec, iExec needs to not (A) make it really easy for developers to do something simple, but (B) make it really possible for developers to do something involved.
However, what we see is that iExec excells mainly at simple stuff; and simple stuff, while cool, usually gets filled under the "tech demo" heading, not under the "useful software" heading.
Instead, if iExec supported things like:
* Multiple dataset (or similar*, confidential data) inputs.
* Gramine over SCONE: to be able to build novel software images easily.
* Some SGX+WASM project: to be able to set up simple scripts.

Then, developers would be able to deliver more with iExec than just what the default tools would provide, and their creativity while using iExec would soar.
Another way to say the same would be to imagine a box of legos. Currently, iExec offers four lego pieces in its box: two same-sized large pieces (data protector & core) that make for a nice base of a house, a whole-wall piece that could make for a wall (oracle factor), and a cute slope that could make the roof. And yes! You can build a whole house with iExec! But... as much as you turn it around, or snap the pieces slightly differently, that's always going to be generally the same house. And cool, you can snap the shapes, but it's not creative with just those four legos... it's.. it's kindergarden-level of lego building.
Meanwhile, other software offers developers much more chance to abandon the "instruction book" and do something fun, weird, wacky, and, once you muscle through those, amazing. What we want is not DataProtector - we can encrypt data with GPG if we want - and what we need is not a poorly-wrapped DRM model (because well, the chapter-at-a-time book-publishing thing doesn't need encrypion, it needs intellectual property laws to work, let's be honest; otherwise the first guy with an OCR-capable phone will republish your chapter at no cost), but an amazing introduction, a base platform, on which to build the rest of our confidential computing platform. But right- as soon as we do that, it turns out it's hobbled by the fact that we can't combine datasets. Our base is exactly as wide as our "wall" pieces - no way to make houses that are not exact squares. And so on: you need to go through SCONE to get permission: meh experience, people will give up before making their cool house of hard-to-snap blocks. You can't run a simple data processing script without a multi-stage build system? Boo- my the non-confidential legos run in my browser with the press of the F12 button, and I can run a non-confidential computation there faster than you can explain the benefits of confidential compute.
