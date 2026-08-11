import { Blocks } from "lucide-react";
import { Button } from "./ui/Button";
import { useOutletContext } from "react-router";
const Navbar = () => {
    const {isSignedIn, username, signIn, signOut} = useOutletContext<AuthContext>();
    const handleAuthClick = async() => {
        if(isSignedIn){
            await signOut();
        } else {
            await signIn();
        }
    }
    return (<>
        <header className="navbar">
            <nav className="inner">
                <div className="left">
                    <div className="brand">
                        <Blocks className="logo" />
                        <span className="name">Archio</span>
                    </div>
                    <ul className="links">
                        <a href="#">Product</a>
                        <a href="#">Pricing</a>
                        <a href="#">Community</a>
                        <a href="#">Enterprise</a>
                    </ul>
                </div>
                <div className="actions">
                    {isSignedIn ? (
                        <>
                            <span className="greeting">{username ? `Welcome, ${username}!` : 'Signed in'}</span>
                            <Button size="sm" onClick={handleAuthClick}>
                                Log Out
                            </Button>
                        </>
                    ) : (
                        <>
                            <Button size="sm" onClick={handleAuthClick} variant="ghost">
                                Log In
                            </Button>
                            <a href="#upload" className="cta">Get Started</a>
                        </>
                    )}
                </div>

            </nav>
        </header>
    </>)
}
export default Navbar