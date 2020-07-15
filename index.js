const Box = require("3box");
const IdentityWallet = require("identity-wallet");
const readline = require("readline-sync");

async function getConsent({ type, origin, spaces }) {
    return true;
}

const spaceName = "ipfsethmarketplace";
const seed = "0x321abc123abc123abc123abc123abcde";

async function main() {
    console.log("start");
    try {
        //create and authenticate bob identity
        const idWallet = new IdentityWallet(getConsent, { seed });
        await idWallet.authenticate([spaceName]);
        const threeIdProvider = idWallet.get3idProvider();
        console.log('idWallet created');

        //create and open 3box for bob
        const box = await Box.openBox(null, threeIdProvider);
        console.log('box created');
        await box.syncDone;
        const space = await box.openSpace(spaceName);
        console.log('space created');
        await space.syncDone;
        console.log("bob DID: ", space.DID);
        // bob DID: did:3:bafyreidatzidf7uh5xx3ucajxejc3o5v3fdc3cwzu2govqyq67gddaxxbe
        console.log("box & space opened");

        //join confidential thread created by alice
        const threadAddress = readline.question(
            "Please enter orbitdb address provided by alice: "
        );
        // public thread: /orbitdb/zdpuAu4xZWS5LCbYuKXSJ61ZeT2S8dDHYGsENXJeJeZRVtYEh/3box.thread.ipfsethmarketplace.thread1
        // confidential thread: /orbitdb/zdpuAnpX6BBw48xM2F14bryx4h2cdA9KHimXsy2Da9VbPPXVR/3box.thread.ipfsethmarketplace.thread1
        console.log("trying to join threadAddress: ", threadAddress);
        const thread = await space.joinThreadByAddress(threadAddress);
        console.log("confidential thread joined: ", thread.address);

        //display thread data
        const members = await thread.listMembers();
        console.log({ members });
        const moderators = await thread.listModerators();
        // should log both alice & bob
        // alice DID: did:3:bafyreifzotxgbsnxqk4alq2kl3jy6geznekx6rjdxbzhymhcy6vzc27sjq
        console.log({ moderators });
        const posts = await thread.getPosts();
        console.log({ posts });

        //logout 3box
        box.logout();

    } catch (error) {
        console.log({ error });
    }
    console.log("done");
    process.exit()
}

main();
