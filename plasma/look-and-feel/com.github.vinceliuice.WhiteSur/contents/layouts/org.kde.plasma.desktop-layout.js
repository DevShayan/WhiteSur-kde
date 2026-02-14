function tryWidgets(panel, ids) {
    for (let i = 0; i < ids.length; i++) {
        if (knownWidgetTypes.indexOf(ids[i]) != -1) {
            return panel.addWidget(ids[i]);
        }
    }
    return null;
}

for (let screen = 0; screen < screenCount; screen++) {
    var panel = new Panel;
    panel.screen = screen;
    var panelScreen = panel.screen;

    // No need to set panel.location as ShellCorona::addPanel will automatically pick one available edge

    // For an Icons-Only Task Manager on the bottom, *3 is too much, *2 is too little
    // Round down to next highest even number since the Panel size widget only displays
    // even numbers
    panel.height = 2 * Math.floor(gridUnit * 2.5 / 2);
    panel.location = "top";
    panel.floating = false;

    // Restrict horizontal panel to a maximum size of a 21:9 monitor
    const maximumAspectRatio = 21/9;
    if (panel.formFactor === "horizontal") {
        const geo = screenGeometry(panelScreen);
        const maximumWidth = Math.ceil(geo.height * maximumAspectRatio);

        if (geo.width > maximumWidth) {
            panel.alignment = "center";
            panel.minimumLength = maximumWidth;
            panel.maximumLength = maximumWidth;
        }
    }

    tryWidgets(panel, [
        "TahoeLauncher",
        "org.kde.plasma.kickoff"
    ]);

    var bpanel = new Panel;
    bpanel.screen = screen;
    bpanel.location = "bottom";
    bpanel.lengthMode = "fit";
    bpanel.hiding = "dodgewindows";
    bpanel.height = 64;

    let taskBar = bpanel.addWidget("org.kde.plasma.icontasks");
    taskBar.currentConfigGroup = ["General"];
    taskBar.writeConfig("launchers", [
        "preferred://filemanager",
        "preferred://browser",
        "applications:org.kde.konsole.desktop",
        "applications:systemsettings.desktop",
        "applications:cursor.desktop",
    ]);
    panel.addWidget("org.kde.plasma.appmenu");
    panel.addWidget("org.kde.plasma.panelspacer");
    panel.addWidget("org.kde.plasma.marginsseparator");
    panel.addWidget("org.kde.plasma.systemtray");
    panel.addWidget("org.kde.plasma.marginsseparator");

    const clock = panel.addWidget("org.kde.plasma.digitalclock");
    clock.currentConfigGroup = ["Appearance"];
    clock.writeConfig("dateFormat", "custom");
    clock.writeConfig("customDateFormat", "ddd MMM d");
    clock.writeConfig("dateDisplayFormat", "BesideTime");

    panel.addWidget("org.kde.plasma.showdesktop");
}
