<template>
    <div id="login">
        <transition name="fade">
            <div v-if="performingRequest" class="loading">
                <p>Loading...</p>
            </div>
        </transition>
        <section>
            <div class="col1">
                <h1>vue-app</h1>
                <p>Bienvenue sur l'application vue-app,<br /> 
                 propulsée avec Vue.js et Firebase. Projet de veille techno. </p>
            </div>
            <div class="col2" :class="{ 'signup-form': !showLoginForm }">
                <form v-if="showLoginForm" @submit.prevent>
                    <h1>Bon retour</h1>

                    <label for="email1">Email</label>
                    <input v-model.trim="loginForm.email" type="text" placeholder="votre@email.com" id="email1" />

                    <label for="password1">mot de passe</label>
                    <input v-model.trim="loginForm.password" type="password" placeholder="******" id="password1" />

                    <button @click="login" class="button">se connecter</button>

                    <div class="extras">
                        <a>mot de passe oublié</a>
                        <a @click='toogleShowLoginForm'>Créer un compte</a>
                    </div>
                </form>
                <form v-else @submit.prevent>
                    <h1>C'est parti</h1>

                    <label for="name">Nom</label>
                    <input v-model.trim="signupForm.name" type="text" placeholder="Jean Michel" id="name" />

                    <label for="title">Titre</label>
                    <input v-model.trim="signupForm.title" type="text" placeholder="vice amiral" id="title" />

                    <label for="email2">Email</label>
                    <input v-model.trim="signupForm.email" type="text" placeholder="votre@email.com" id="email2" />

                    <label for="password2">Mot de passe</label>
                    <input v-model.trim="signupForm.password" type="password" placeholder="minimum 6 charactères" id="password2" />

                    <button @click="signup" class="button">S'inscrire</button>

                    <div class="extras">
                        <a @click="toogleShowLoginForm">se connecter</a>
                    </div>
                </form>
                    <transition name="fade">
                        <div v-if="errorMsg !== ''" class="error-msg">
                            <p>{{ errorMsg }}</p>
                        </div>
                    </transition>
            </div>
        </section>
    </div>
</template>

<script>
    const fb = require('../firebaseConfig.js');
    export default {
        data() {
            return {
                loginForm: {
                    email:    "",
                    password: ""
                },
                signupForm: {
                    name:     "",
                    title:    "",
                    email:    "",
                    password: ""
                },
                showLoginForm : true,
                performingRequest : false,
                errorMsg : ""
            }
        },
        methods: {
            toogleShowLoginForm() {
                this.showLoginForm = !this.showLoginForm;
            },
            login() {
                this.performingRequest = true

                fb.auth.signInWithEmailAndPassword(this.loginForm.email, this.loginForm.password).then(user => {
                    this.$store.commit('setCurrentUser', user.user)
                    this.$store.dispatch('fetchUserProfile')
                    this.performingRequest = false
                    this.$router.push('/dashboard')
                }).catch(err => {
                    console.log(err)
                    this.errorMsg = err.message
                    this.performingRequest = false
                })
            },
            signup() {
                this.performingRequest = true

                fb.auth.createUserWithEmailAndPassword(this.signupForm.email, this.signupForm.password).then(user => {
                    this.$store.commit('setCurrentUser', user.user)
                    // create user obj
                    fb.usersCollection.doc(user.uid).set({
                        name: this.signupForm.name,
                        title: this.signupForm.title
                    }).then(() => {
                        this.$store.dispatch('fetchUserProfile')
                        this.performingRequest = false
                        this.$router.push('/dashboard')
                    }).catch(err => {
                        console.log(err)
                        this.errorMsg = err.message
                        this.performingRequest = false
                    })
                }).catch(err => {
                    console.log(err)
                    this.errorMsg = err.message
                })

            },
        }
    }
</script>
