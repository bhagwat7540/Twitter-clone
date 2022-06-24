async function refreshPosts() {
  $(".postsContainer").empty();
  const posts = await axios.get("/api/post");

  for (let post of posts.data) {
    const html = createPostHtml(post);
    $(".postsContainer").prepend(html);
  }
}

refreshPosts();

// Creating a new post
$("#submitPostButton").click(async () => {
  const postText = $("#post-text").val();
  await axios.post("/api/post", { content: postText });
  $("#post-text").val("");
  refreshPosts();
});

$(document).on("click", ".likeButton", (event) => {
  // console.log("clicked");

  const button = $(event.target);
  const postId = getPostIdFromElement(button);

  console.log(postId);
});

function getPostIdFromElement(element) {
  const isRoot = element.hasClass("post");

  const rootElement = isRoot === true ? element : element.closest(".post");

  const postId = rootElement.data().id;

  return postId;
}

function createPostHtml(postData) {
  const postedBy = postData.postedBy;

  if (postedBy._id === undefined) {
    return console.log("User object not populated");
  }

  const displayName = postedBy.firstName + " " + postedBy.lastName;
  const timestamp = postData.createdAt;

  return `
    <div class="post" data-id="${postData._id}">
      <div class="mainContentContainer">
        <div class="userImageContainer">
          <img src="${postedBy.profilePic}" />
        </div>
        <div class="postContentContainer">
          <div class="header">
            <a href="/profile/${postedBy.username}" class="displayName">
              ${displayName}
            </a>
            <span class="username">@${postedBy.username}</span>
            <span class="date">${timestamp}</span>
          </div>
          <div class="postBody">
            <span>${postData.content}</span>
          </div>
          <div class="postFooter">
            <div class="postButtonContainer">
              <button>
                <i class="far fa-comment"></i>
              </button>
            </div>
            <div class="postButtonContainer green">
              <button class="retweet">
                <i class="fas fa-retweet"></i>
              </button>
            </div>
            <div class="postButtonContainer red">
              <button class="likeButton">
                <i class="far fa-heart"></i>
                <span>${postData.likes.length}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
}
