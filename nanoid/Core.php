<?php

class Core
{

    const SAFE_SYMBOLS = '0123456789';
    const MASKS = [15, 31, 63, 127, 255];

    public function random($generator, $size, $alphabet = '0123456789')
    {
        $len = strlen($alphabet);
        $mask = (2 << log($len - 1) / 0.69314718055994530942) - 1;
        $step = (int) ceil(1.6 * $mask * $size / $len);
        $id = '';
        while (true) {
            $bytes = unpack('C*', \random_bytes($size));
            for ($i = 1; $i <= $step; $i++) {
                $byte = $bytes[$i] & $mask;
                if (isset($alphabet[$byte])) {
                    $id .= $alphabet[$byte];
                    if (strlen($id) === $size) {
                        return $id;
                    }
                }
            }
        }
    }
}
?>
