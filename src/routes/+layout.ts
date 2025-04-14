// breaks some features, also doesn't make sense since page content is dynamically created by cytoscape
// (which would then need a fake DOM, which doesn't work with webGL, and so forth)
export const ssr = false;
export const prerender = false;