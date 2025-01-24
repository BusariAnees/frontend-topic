
document.addEventListener("DOMContentLoaded", () => {
    const links = document.querySelectorAll(".nav-link");
    const sections = document.querySelectorAll(".content-section");
  
    const main = document.querySelector("#main-topic");

    main.classList.add("active")
    // Add click event listener to each link
    links.forEach(link => {
      link.addEventListener("click", (e) => {
        e.preventDefault();
  
        // Get the target section from data-target attribute
        const target = link.getAttribute("data-target");
  
        // Hide all sections
        sections.forEach(section => {
          section.classList.remove("active");
        });
  
        // Show the targeted section
        document.getElementById(target).classList.add("active");
      });
    });
  });