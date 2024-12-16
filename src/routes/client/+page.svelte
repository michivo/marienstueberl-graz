<div class="container">
    <a href="/client/reservation">Termin reservieren</a>
    <a href="/client/pickup">Abholen</a>
</div>


<style>
    .container {
        display: flex;
        justify-content: start;
        align-items: center;
        height: 100vh;
        flex-direction: column;
        gap: 2rem;
        padding: 2rem;
    }

    a {
        font-size: 2rem;
        padding: 2rem 0;
        border: none;
        cursor: pointer;
        border: 1px solid black;
        border-radius: 0.25rem;
        box-shadow: 1px 1px 2px var(#000);
        width: 25rem;
        text-align: center;
        max-width: 100%;
        color: black;
        text-decoration: none;
        font-weight: 200;
    }

    a:hover, a:active {
        background-color: var(--highlight-red);
        color: white;
    }
</style>
