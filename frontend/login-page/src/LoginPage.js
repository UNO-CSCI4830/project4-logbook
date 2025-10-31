import './LoginPage.css'; // optional styling

function LoginPage() {
    const handleClick = (e) => {
        e.preventDefault();
    const randomColor = `#${Math.floor(Math.random() * 16777215).toString(16)}`;
    document.body.style.backgroundColor = randomColor;
    };


    return (
        <div className="login-container">
            {/* Logo Placeholder */}
            <div className="logo-placeholder">[Logo]</div>

            {/* Welcome Message */}
            <h2>Welcome to Our App</h2>

            {/* Input Fields */}
            <form>
                <input type="text" placeholder="Username" className="input-field" />
                <input type="password" placeholder="Password" className="input-field" />
                <button type="submit" className="go-button" onClick={handleClick}>Go!</button>
            </form>
        </div>
    );
}

export default LoginPage;