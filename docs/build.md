# Build Notes for Maintainers

## Build Artifacts

After each CI process completes on the master branch, build artifacts are stored in the 
build artifacts under the *Build* step.  By default, the artifacts are
set to expire in 3 days.  If you have pushed up a change to the master
branch that is to be considered a new release, you **must click on the
build phase of the completed pipeline and, under the artifacts settings,
click the `Keep` button.**

The UI will check the following url each time it launches to determine
if there is an update to the UI core that should occur:

    https://gitlab.com/serial-lab/quartet-ui/builds/artifacts/master/raw/dist?job=build
    
This url is defined in the core UI's `package.json` file under the 
`publish` key.  This is where any updates will be located and if the
version in the `latest.yml` file in the last build artifacs directory 
is greater than 
the current running version then the UI will attempt to update itself 
using the artifacts found in the CI pipeline.

**Note**: If you have accidentally pushed a change up to master and it 
has generated the artifacts noted above, any newly launched UI instances
will attempt to use these artifacts to update themselves.  As a result,
** it is not recommended to do any development on the master branch as
this could result in an inadvertent update to any running clients**.
