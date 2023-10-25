// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

contract AnimatedGif {
    error ErrorOnlyOwner();

    struct Pixel {
        uint8 r;
        uint8 g;
        uint8 b;
    }
    uint8 public constant MAX_XY = 32;
    uint8 public constant MAX_FRAMES = 50;
    address private _owner;

    Pixel[MAX_FRAMES][MAX_XY][MAX_XY] public matrix;

    constructor() {
        _owner = msg.sender;
    }

    // Function to set the color of a pixel at a specific position
    function setPixelColor(
        uint8 x,
        uint8 y,
        uint8 z,
        uint8 r,
        uint8 g,
        uint8 b
    ) public onlyOwner {
        require(x < MAX_XY && y < MAX_XY && z < MAX_FRAMES, "Invalid position");
        matrix[z][x][y] = Pixel(r, g, b);
    }

    // Function to get the color of a pixel at a specific position
    function getPixelColor(
        uint8 x,
        uint8 y,
        uint8 z
    ) public view returns (uint8, uint8, uint8) {
        require(x < MAX_XY && y < MAX_XY && z < MAX_FRAMES, "Invalid position");
        Pixel memory pixel = matrix[z][x][y];
        return (pixel.r, pixel.g, pixel.b);
    }

    // Function to get the color matrix for a specific z-layer
    function getMatrixForLayer(
        uint8 z
    ) public view returns (uint8[32 * 32 * 3] memory) {
        require(z < MAX_FRAMES, "Invalid layer");

        uint8[32 * 32 * 3] memory colors;
        uint256 idx = 0;

        for (uint8 x = 0; x < MAX_XY; x++) {
            for (uint8 y = 0; y < MAX_XY; y++) {
                Pixel memory pixel = matrix[z][x][y];
                colors[idx] = pixel.r;
                colors[idx + 1] = pixel.g;
                colors[idx + 2] = pixel.b;
                idx += 3;
            }
        }

        return colors;
    }

    // Function to set the colors of multiple pixels in a specific z-layer
    function setPixelColors(
        uint8 z,
        uint8[] memory xArray,
        uint8[] memory yArray,
        uint8[] memory rArray,
        uint8[] memory gArray,
        uint8[] memory bArray
    ) public onlyOwner {
        require(z < MAX_FRAMES, "Invalid layer");

        uint256 numPixels = xArray.length;
        require(
            numPixels == yArray.length &&
                numPixels == rArray.length &&
                numPixels == gArray.length &&
                numPixels == bArray.length,
            "Input arrays must have the same length"
        );

        for (uint256 i = 0; i < numPixels; i++) {
            uint8 x = xArray[i];
            uint8 y = yArray[i];
            uint8 r = rArray[i];
            uint8 g = gArray[i];
            uint8 b = bArray[i];

            require(x < MAX_XY && y < MAX_XY, "Invalid position");
            matrix[z][x][y] = Pixel(r, g, b);
        }
    }

    /**
     * @dev Throws if the sender is not the minter.
     */
    function _checkOwner() private view {
        if (owner() != msg.sender) revert ErrorOnlyOwner();
    }

    /**
     * @dev Returns the address of the current owner.
     */
    function owner() public view virtual returns (address) {
        return _owner;
    }

    modifier onlyOwner() {
        _checkOwner();
        _;
    }
}
