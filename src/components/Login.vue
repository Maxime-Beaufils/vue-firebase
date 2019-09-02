<template>
    <div id="login">
        <section>
            <div class="col1">
                <h1>vue-firebase</h1>
                <p>Bienvenue sur l'application vue-firebase propuslée avec Vue.js et Firebase.
                    Projet de veille techno </p>
            </div>
            <div class="col2">
                <form>
                    <h1>Bon retour</h1>

                    <label for="email1">Email</label>
                    <input type="text" placeholder="you@email.com" id="email1" />

                    <label for="password1">mot de passe</label>
                    <input type="password" placeholder="******" id="password1" />

                    <button class="button">se connecter</button>

                    <div class="extras">
                        <a>mot de passe oublié</a>
                        <a>Créer un compte</a>
                    </div>
                </form>
            </div>
        </section>
    </div>
</template>

<script>
    export default {
    
    }
</script>