export default `
/* hide annoyances */
.navigation__native-cta, .banner-container { display: none }

/* visual rebalance of logo pos */
.logo-container > .logo { padding-top: 20px }

/* modal styles */
.pj-modal-root {
	position: fixed;
	left: 0;
	top: 0;
	width: 100vw;
	height: 100vh;
	z-index: 9999;
	background: rgba(0,0,0, 0.4);
	display: flex;
	align-items: center;
	justify-content: center;
}

.pj-modal {
	background: white;
	border-radius: 0.5rem;
	min-width: 30rem;
}

.pj-modal-header {
	display: flex;
	align-items: center;
	font-size: 1.5em;
	padding: .75rem;
}

button.pj-modal-close {
	width: .8em;
	height: .8em;
	margin-left: .2rem;
	margin-right: .75rem;

	-webkit-mask-image: var(--mask);
	mask-image: var(--mask);
	background: #888888;

	border: none;
}

.pj-settings {
	padding: .75rem;
	display: grid;
	grid-template-columns: max-content auto;
	justify-items: start;
	column-gap: 1rem;
}
`;