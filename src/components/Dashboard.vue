<template>
  <div id="dashboard">
    <section>
      <!-- comment modal -->
      <transition name="fade">
        <div v-if="showCommentModal" class="c-modal">
          <div class="c-container">
            <a @click="closeCommentModal">X</a>
            <p>add a comment</p>
            <form @submit.prevent>
              <textarea v-model.trim="comment.content"></textarea>
              <button
                @click="addComment"
                :disabled="comment.content == ''"
                class="button"
              >add comment</button>
            </form>
          </div>
        </div>
      </transition>
      <!-- post modal -->
      <transition name="fade">
        <div v-if="showPostModal" class="p-modal">
          <div class="p-container">
            <a @click="closePostModal" class="close">X</a>
            <div class="post">
              <h5>{{ fullPost.userName }}</h5>
              <span>{{ fullPost.createdOn | formatDate }}</span>
              <p>{{ fullPost.content }}</p>
              <ul>
                <li>
                  <a>comments {{ fullPost.comments }}</a>
                </li>
                <li>
                  <a>likes {{ fullPost.likes }}</a>
                </li>
              </ul>
              <ul>
                <li v-if="showDelPost">
                  <a @click="openEditModal(fullPost)">Modifier ce message</a>
                </li>
                <li v-if="showDelPost">
                  <a @click="delPost(fullPost)">supprimer ce message</a>
                </li>
              </ul>
            </div>
            <div v-show="postComments.length" class="comments">
              <div v-for="comment in postComments" class="comment" :key="comment.id">
                <p>{{ comment.userName }}</p>
                <span>{{ comment.createdOn | formatDate }}</span>
                <p>{{ comment.content }}</p>
              </div>
            </div>
          </div>
        </div>
      </transition>
      <!-- edit modal -->
      <transition name="fade">
        <div v-if="showEditModal" class="c-modal">
          <div class="c-container">
            <a @click="closeEditModal">X</a>
            <p>Modifier ce message</p>
            <form @submit.prevent>
              <textarea v-model.lazy="fullPost.content"></textarea>
              <button @click="editPost(fullPost)" class="button">Modifier</button>
            </form>
          </div>
        </div>
      </transition>
       <!-- creer message -->
      <div class="col1">
        <div class="profile">
          <h5>{{ userProfile.name }}</h5>
          <p>{{ userProfile.title }}</p>
          <div class="create-post">
            <p>Créer un message</p>
            <form @submit.prevent>
              <textarea v-model.trim="post.content"></textarea>
              <button @click="createPost" :disabled="post.content === ''" class="button">poster</button>
            </form>
          </div>
        </div>
      </div>
      <!-- liste des messages -->
      <div class="col2">
        <transition name="fade">
          <div v-if="hiddenPosts.length" @click="showNewPosts" class="hidden-posts">
            <p>
              Click pour voir
              <span class="new-posts">{{ hiddenPosts.length }}</span>
              <span v-if="hiddenPosts.length > 1">nouveaux</span>
              <span v-else>nouveau</span>
              <span v-if="hiddenPosts.length > 1">messages</span>
              <span v-else>message</span>
            </p>
          </div>
        </transition>
        <div v-if="posts.length">
          <div v-for="post in posts" class="post" :key="post.id">
            <h5>{{ post.userName }}</h5>
            <span>{{ post.createdOn | formatDate }}</span>
            <p>{{ post.content | trimLength }}</p>
            <ul>
              <li>
                <a @click="openCommentModal(post)" jest="show-comment-modal">commentaires: {{ post.comments }}</a>
              </li>
              <li>
                <a @click="likePost(post.id, post.likes)" > likes: {{ post.likes }}</a>
              </li>
              <li>
                <a @click="viewPost(post)">voir la suite</a>
              </li>
            </ul>
          </div>
        </div>
        <div v-else>
          <p class="no-results">Il n'y a actuelement aucun message</p>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import { mapState } from "vuex";
import moment from "moment";
import router from "../router";
const fb = require("../firebaseConfig.js");

export default {
  data() {
    return {
      post: {
        content: ""
      },
      comment: {
        postId: "",
        userId: "",
        content: "",
        postComments: 0
      },
      showCommentModal: false,
      showPostModal: false,
      showEditModal: false,
      showDelPost: false,
      fullPost: {},
      postComments: []
    };
  },
  computed: {
    ...mapState(["userProfile", "currentUser", "posts", "hiddenPosts"])
  },
  methods: {
    createPost() {
      fb.postsCollection
        .add({
          createdOn: new Date(),
          content: this.post.content,
          userId: this.currentUser.uid,
          userName: this.userProfile.name,
          comments: 0,
          likes: 0
        })
        .then(ref => {
          this.post.content = "";
        })
        .catch(err => {
          console.log(err);
        });
    },
    delPost(post) {
      this.$dialog
        .confirm("êtes-vous sûr de vouloir supprimer ce message ?")
        .then(() => {
          fb.postsCollection
            .doc(post.id)
            .delete()
            .then(() => {
              this.showPostModal = false;
            })
            .catch(error => {
              alert("Error removing document: ", error);
            });
        })
        .catch(error => {
          console.log(error);
        });
    },
    editPost(post) {
      fb.postsCollection
        .doc(post.id)
        .update({
          content: post.content
        })
        .then(() => {
          this.showEditModal = false;
        })
        .catch(error => {
          alert("Error removing document: ", error);
        });
    },
    openEditModal(post) {
      this.comment.postId = post.id;
      this.comment.userId = post.userId;
      this.comment.postComments = post.comments;
      this.showEditModal = true;
    },
    closeEditModal() {
      this.comment.postId = "";
      this.comment.userId = "";
      this.comment.content = "";
      this.showEditModal = false;
    },
    showNewPosts() {
      let updatedPostsArray = this.hiddenPosts.concat(this.posts);
      // clear hiddenPosts array and update posts array
      this.$store.commit("setHiddenPosts", null);
      this.$store.commit("setPosts", updatedPostsArray);
    },
    openCommentModal(post) {
      this.comment.postId = post.id;
      this.comment.userId = post.userId;
      this.comment.postComments = post.comments;
      this.showCommentModal = true;
    },
    closeCommentModal() {
      this.comment.postId = "";
      this.comment.userId = "";
      this.comment.content = "";
      this.showCommentModal = false;
    },
    addComment() {
      let postId = this.comment.postId;
      let postComments = this.comment.postComments;

      fb.commentsCollection
        .add({
          createdOn: new Date(),
          content: this.comment.content,
          postId: postId,
          userId: this.currentUser.uid,
          userName: this.userProfile.name
        })
        .then(doc => {
          fb.postsCollection
            .doc(postId)
            .update({
              comments: postComments + 1
            })
            .then(() => {
              this.closeCommentModal();
            });
        })
        .catch(err => {
          console.log(err);
        });
    },
    likePost(postId, postLikes) {
      let docId = `${this.currentUser.uid}_${postId}`;

      fb.likesCollection
        .doc(docId)
        .get()
        .then(doc => {
          if (doc.exists) {
            return;
          }

          fb.likesCollection
            .doc(docId)
            .set({
              postId: postId,
              userId: this.currentUser.uid
            })
            .then(() => {
              // update post likes
              fb.postsCollection.doc(postId).update({
                likes: postLikes + 1
              });
            });
        })
        .catch(err => {
          console.log(err);
        });
    },
    viewPost(post) {
      this.currentUser.uid === post.userId
        ? (this.showDelPost = true)
        : (this.showDelPost = false);
      fb.commentsCollection
        .where("postId", "==", post.id)
        .get()
        .then(docs => {
          let commentsArray = [];

          docs.forEach(doc => {
            let comment = doc.data();
            comment.id = doc.id;
            commentsArray.push(comment);
          });

          this.postComments = commentsArray;
          this.fullPost = post;
          this.showPostModal = true;
        })
        .catch(err => {
          console.log(err);
        });
    },
    closePostModal() {
      this.postComments = [];
      this.showPostModal = false;
    }
  },
  filters: {
    formatDate(val) {
      if (!val) {
        return "-";
      }
      let date = val.toDate();
      return moment(date).fromNow();
    },
    trimLength(val) {
      if (val.length < 200) {
        return val;
      }
      return `${val.substring(0, 200)}...`;
    }
  }
};
</script>
