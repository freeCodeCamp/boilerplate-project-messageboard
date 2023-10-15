const getRepliesArray = (replies) => {
    let newArray = replies

    newArray.sort((a,b) => {return a.created_on > b.created_on ? -1: a.created_on < b.created_on ? 1 : 0})
    if(newArray.length > 3) {
      newArray = newArray.slice(0,3)
    }

    return newArray.map(reply => {
        const {
          _id,
          text,
          created_on
        } = reply
        return {
          _id,
          text,
          created_on
        }
    })
}

const getThreadsArray = (threads) => {
    let newArray = threads
    newArray.sort((a,b) => {return a.bumped_on > b.bumped_on ? -1: a.bumped_on < b.bumped_on ? 1 : 0})
    if(newArray.length > 10) {
        newArray = newArray.slice(0,10)
    }

    return newArray.map(thread => {
        const {
          _id,
          text,
          created_on,
          bumped_on
        } = thread

        const replies = getRepliesArray(thread.replies)

        return {
          _id,
          text,
          created_on,
          bumped_on,
          replies,
          replyCount: replies.length
        }
      })
}

exports.getRepliesArray = getRepliesArray
exports.getThreadsArray = getThreadsArray