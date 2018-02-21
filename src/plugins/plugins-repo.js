/**
 * Lists of all plugins currently available.
 * Should be replaced with a remote JSON eventually or an API.
 *
 **/

export default {
  NumberRange: {
    core: true,
    preview: "/plugin-screenshots/number-range.png",
    initPath: "number-range/src/init.js",
    readableName: "Serial Number Range Management",
    pluginName: "NumberRange",
    description: `
                The Serial Number Range Management plugin offers users the
                ability to interact with SerialBox, the backend solution for
                your serial number range management requirements.

                Among other functions, this plugin offers the ability to create
                pools and serial number ranges as well as allocate numbers on
                the fly from the QU4RTET interface.
            `
  }
};
