// Mobile Navigation Toggle
const navToggle = document.getElementById('navToggle');
const navMenu = document.getElementById('navMenu');
const navLinks = document.querySelectorAll('.nav-menu a, .nav-quicklink');

if (navToggle && navMenu) {
    const setMenuState = (isOpen) => {
        navMenu.classList.toggle('active', isOpen);
        navToggle.setAttribute('aria-expanded', String(isOpen));
    };

    navToggle.addEventListener('click', () => {
        setMenuState(!navMenu.classList.contains('active'));
    });

    // Close mobile menu when clicking on a link
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            setMenuState(false);
        });
    });

    // Close the menu when tapping/clicking outside the nav
    document.addEventListener('pointerdown', (event) => {
        if (!navMenu.classList.contains('active')) return;
        if (navMenu.contains(event.target) || navToggle.contains(event.target)) return;
        setMenuState(false);
    });

    // Close the menu with Escape key
    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape') {
            setMenuState(false);
        }
    });
}

// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;
        
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
            const navbarHeight = document.querySelector('.navbar').offsetHeight;
            const targetPosition = targetElement.offsetTop - navbarHeight;
            
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// Active navigation link on scroll
window.addEventListener('scroll', () => {
    const sections = document.querySelectorAll('section[id]');
    const navbarHeight = document.querySelector('.navbar').offsetHeight;
    const scrollPosition = window.scrollY + navbarHeight + 10;
    
    let currentSection = '';
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        const sectionId = section.getAttribute('id');
        
        // Check if the scroll position is within this section
        if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
            currentSection = sectionId;
        }
    });
    
    // Update nav links
    navLinks.forEach(link => {
        link.style.borderBottomColor = 'transparent';
        link.style.color = '';
        
        if (link.getAttribute('href') === `#${currentSection}`) {
            link.style.color = 'var(--gold-deep)';
            link.style.borderBottomColor = 'var(--gold-deep)';
        }
    });
});

/* New form */
const form = document.getElementById("form");
const result = document.getElementById("result");

if (form && result) {
    form.addEventListener("submit", function (e) {
        e.preventDefault();

        let submissionSucceeded = false;

        const formData = new FormData(form);

        // Get the name input value
        const name = formData.get("name");

        // Create a custom subject
        const subject = `${name} sent a message through LadnikLawGroup.com`;

        // Append the custom subject to the form data
        formData.append("subject", subject);

        const object = Object.fromEntries(formData);
        const json = JSON.stringify(object);

        result.innerHTML = "Please wait...";

        fetch("https://api.web3forms.com/submit", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
            },
            body: json,
        })
            .then(async (response) => {
                let json = await response.json();
                if (response.status == 200) {
                    submissionSucceeded = true;
                    result.style.display = "block";
                    result.innerHTML = `${json.message} Someone from Ladnik Law Group will contact you shortly.`;
                } else {
                    console.log(response);
                    submissionSucceeded = false;
                    result.style.display = "block";
                    result.innerHTML = json.message;
                }
            })
            .catch((error) => {
                console.log(error);
                submissionSucceeded = false;
                result.style.display = "block";
                result.innerHTML = "Something went wrong!";
            })
            .then(function () {
                if (submissionSucceeded) {
                    form.reset();
                    return;
                }

                setTimeout(() => {
                    result.style.display = "none";
                }, 3000);
            });
    });
}

/* End new form */

// Intersection Observer for fade-in animations
const observerOptions = {
    threshold: 0,
    rootMargin: '0px 0px 100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translate3d(0, 0, 0) scale(1)';
            entry.target.style.filter = 'blur(0px)';
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

// Apply animations to marked sections and cards
document.addEventListener('DOMContentLoaded', () => {
    const animatedElements = document.querySelectorAll('[data-reveal]');
    
    animatedElements.forEach((el, index) => {
        const horizontalOffset = index % 2 === 0 ? -34 : 34;
        el.style.opacity = '0';
        el.style.transform = `translate3d(${horizontalOffset}px, 40px, 0) scale(0.96)`;
        el.style.filter = 'blur(10px)';
        const stagger = Math.min(index * 0.03, 0.24);
        el.style.transition = `opacity 0.58s cubic-bezier(0.22, 1, 0.36, 1) ${stagger}s, transform 0.58s cubic-bezier(0.22, 1, 0.36, 1) ${stagger}s, filter 0.52s ease-out ${stagger}s`;
        observer.observe(el);
    });
});
