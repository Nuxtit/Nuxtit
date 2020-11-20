# Roadmap

# 1.0

- [x] Dark Theme
- [x] Vote on comments and posts anywhere
- [x] user page
- [x] Browsing subreddit posts
- [x] Browsing multireddit posts
- [] Browse /r/:subreddit/comments (comments without post, and for multis if possible)
- [x] Make Comments
- [x] collapse all/none
- [x] load more comments
- [x] post self posts
- [x] post link posts
- [x] crosspost
- [x] URL rewrites
- [x] Scroll to Top when fetching new page of posts
- [x] check for new messages every 5 minutes
- [x] show link and user flair
- [x] local storage sync across tabs
- [ ] full search
- [ ] saved searches
- [ ] green response message for post/crosspost/comment/sent-mail saved/updated
- [] subreddit pages
- [] Queue - add things to a queue instead of new tabs.
- [] post uploaded image posts
- [x] api log
- [x] mailbox (all-inbox, reply, sent)
- [] mailbox compose
- [] mailbox modmail
- [] retry failed actions
- [x] Browse Your Multi-Reddits
- [x] settings page
- [x] masstagger settings
- [x] censor usernames option (for screenshots)
- [] Add subreddits to your mutis
- [] 404 page
- [] highlight friends and followees
- [x] masstagger
- [x] Bootstrap 4 Vue codesplitted
- [x] "other discussions"
- [] download from reddit/imgur (bypass '\_d')
- [x] image preview in app
    - [x] preview supports imgur gifv as .gif
    - [ ] imgur album support
- [x] browsing history
- [] Replace 1MB fontawesome 4.7 icons with treeshaked file http://fontello.com/
- [] a small number of existing tests (thinking about using ava)
- [] comment replaces CommentForm up after you click done
- [] post shows up in /duplicates after you click done
- [x] subreddit subscribe button
- [x] message telling you that you can't post in a sub
- [] Post Sorts need time period filter
- [] cache subreddit about

# TBA

- Settings to hide icon-text or icons or gold
- User selecting theme: https://bootswatch.com/
- Settings disable masstagger

# Tabled

- Any moderator tool
- Reddit Gold - features, giving gold, etc.
- Keyboard shortcuts
    - high interest, perfection desired.
- Swipe/TouchEvents
- RES integration: implement the following features from preexisting RES data:
    - tagged users
    - filter comments/posts
- Offline storage of subreddits, threads, users
    - LocalStorage is MB, other solutions are complicated.
    - Syncing sounds like it would impact battery usage over time.
    - may require addition of backend infrastructure.
- filter user's history by search + subreddit
- quickly edit own flair

# Avoiding Consideration

- Optional Infinite Scrolling
    - only if your position is not whiped out when returing from a result.
    - looking to mitigate the need for it via the Queue feature.


# Never

| Description | Release |   |   |   |
|---|---|---|---|---|
| Showing the sidebar. | 1.0 |   |   |   |
|   | 1.0 |   |   |   |
|   | 1.0 |   |   |   |
|   | 1.0 |   |   |   |
|   | 1.0 |   |   |   |
|   | 1.0 |   |   |   |
|   | TBA |   |   |   |
|   | TBA |   |   |   |
|   | TBA |   |   |   |
|   | TBA |   |   |   |
|   | TBA |   |   |   |
|   | TBA |   |   |   |


Showing the sidebar.

It's very common to have to explain and re-explain what's listed in the sidebar because "lol I can't read it I'm on mobile right now".

curl 'https://oauth.reddit.com/api/set_subreddit_sticky?raw_json=1&gilding_detail=1' -H 'User-Agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:81.0) Gecko/20100101 Firefox/81.0' -H 'Accept: */*' -H 'Accept-Language: en-US,en;q=0.5' --compressed -H 'Referer: https://new.reddit.com/' -H 'Content-Type: application/x-www-form-urlencoded' -H 'Origin: https://new.reddit.com' -H 'Connection: keep-alive' -H 'TE: Trailers' --data-raw 'id=t3_jnamlr&state=true&to_profile=false'
