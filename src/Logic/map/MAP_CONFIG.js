const MAP_CONFIG = {
    CELL_WIDTH: 50,
    CELL_HEIGHT: 50,

    MAP_WIDTH:  7,
    MAP_HEIGHT: 5
}

MAP_CONFIG.CELL_HALF_WIDTH = MAP_CONFIG.CELL_WIDTH  / 2
MAP_CONFIG.CELL_HALF_HEIGHT = MAP_CONFIG.CELL_HEIGHT  / 2

MAP_CONFIG.HALF_CELL_DIMENSIONS_OFFSET = [
    [   0,                            MAP_CONFIG.CELL_HALF_HEIGHT,                              0    ],
    [   MAP_CONFIG.CELL_HALF_WIDTH,                             0,     MAP_CONFIG.CELL_HALF_WIDTH    ],
    [   0,                            MAP_CONFIG.CELL_HALF_HEIGHT,                              0    ]
]