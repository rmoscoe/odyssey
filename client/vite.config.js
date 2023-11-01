import svgr from "vite-plugin-svgr";

export default {
    "base": "/static/",
    plugins: [svgr({
        svgrOptions: {
            replaceAttrValues: {
                '#000000': "{props.color}"
            }
        }
    })],
}