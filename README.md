## contentport

MVP

- [x] Style dropdown and config
- [x] Make assistant list improvements
- [x] No refresh needed after new context doc
- [ ] Remove save/history

style tab:

- [ ] Add new style
- [ ] Import tweets
- [ ] Custom prompt

edit tool should just know about:

- [ ] Current message
- [ ] Previous suggestions
- [ ] Current tweet state

CURRENT

- [ ] Remove "al tweets" - just show all for simplicity

BUGS

- [ ] Safari image editor doesnt work
- [ ] Chrome edit image doesnt work
- [ ] After some time most recent tweets are not shown in sidebar, only after reloading

NEED TO DO BEFORE NEXT SHIP:

BUG FIXES

- [ ] When clicking "new tweet", start a new chat

PRIORITY

- [ ] One tweet can override another in recents HARD
- [ ] Implement back rate-limiting EASY
- [ ] Allow navigation while chatting to asisstant (ideally just like openai desktop) HARD
      HOTFIX: force nav to studio if not already there
- [ ] Refresh knowledge base after onboarding and after inserting new document EASY
      LET IN BATCH - 50
- [ ] Drafts (3 to choose from)
- [ ] Offer option to save as knowledge doc EASY
      LET IN BATCH
- [ ] Image editor fixes HARD
- [ ] Image tool doesnt work anymore
      LET IN BATCH

FEATURE IDEAS

- [ ] Show related documents to user query in chat (e.g. typed in ...about contentport) -> suggest docs related to contentport above certain threshold (0.9)

### Before pushing to prod

- Set the stripe secret and public keys to prod values
- Check that the values in `src/constants/stripe-prodcuts.ts` have the values you want for the production product
- Reset values of `src/constants/stripe-subscription.ts` to `null` so that seeding will populate the constant used in the code to production product values
- Run the seed-stripe command
- Commit the seeded product json file
- Push to prod




- q: how do I upload videos? dragging not too intuitive



UX problems
- pages not integrated well with each other
- no visual option to add images / videos directly
- no realistic twitter preview
- you cannot @people

BUGS:
- after typing in tweet editor, then typing in chat, after the first letter it loses focus

TO BECOME OPEN
- queueing tweet then editing -> duplicate in queue (X)
- rejecting doesnt work well?
- do something with posted tweets
- allow deleting uploading (in progress) images in chat
- make uploading image not un-focus editor