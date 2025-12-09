'use client';
import './about.css';


export default function AboutPage() {
    return (
        <section className="about-content">
                <h1>About</h1>
            <div className="about-text">
                <p>
                    Welcome to your very own Appliance Logbook! Let's face it, life can be hectic & sometimes we forget about things. 
                    Like, where did I get that microwave? Does it need new oil? How do I use my warranty. Well we're here for you. 
                    The Appliance Logbook is made so that you can keep trap of all of those silly ifs & buts. 
                </p>
                <p>
                    Our goal is simple. To help you out by taking note of your appliances and letting you know when 
                    it's time to take action. Regardless of what it needs, you'll be able to see. 
                    The best part? It's all digital. Meaning that you find it anywhere you have access to a web device!
                </p>
                <p>
                    What can I do with the logbook?:
                </p>
                <ul>
                    <li>Add, Edit, and Remove your Appliances</li>
                    <li>Alerts for upcoming repairs</li>
                    <li>Adjust Status for Maintenance </li>
                    <li>Notifications sent to you to know what's happening</li>
                </ul>
                

                <h2>How do i add to my logbook? </h2>

                <video src="/Vid1.mp4" controls width="600"  >
                    Your browser does not support the video tag.
                </video>
                <p className="video-text">
                    In this video, we show you how to add & edit your appiliances in your 
                    logbook. (PS: Thank you Alan)
                    </p>

                <h2>How do I use my alerts? </h2>
                <video src="/Vid2.mp4" controls width="600"  >
                    Your browser does not support the video tag.
                </video>

                <p className="video-text">
                    In this video, we show you & talk about your alerts. 
                    </p>
                <h3>
                    Thank you for choosing us to help your life be easier!
                </h3>
            </div>
        </section>
    );
}