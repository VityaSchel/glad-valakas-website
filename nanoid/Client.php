<?php

class Client
{
    const MODE_NORMAL = 1;
    const MODE_DYNAMIC = 2;

    const SAFE_SYMBOLS = '0123456789';

    protected $alphbet;
    protected $size;

    private $core;
    protected $generator;

    public function __construct($size = 21, $generator = null)
    {
        $this->size = $size > 0 ? $size : 21;
        $this->generator = $generator;
        $this->core = new Core();
        $this->alphbet = self::SAFE_SYMBOLS;
    }

    public function generateId($size = 0, $mode = self::MODE_NORMAL)
    {
        $size = $size>0? $size: $this->size;
        switch ($mode) {
            case self::MODE_DYNAMIC:
                return $this->core->random($this->generator, $size, $this->alphbet);
            default:
                return $this->normalRandom($size);
        }
    }

    public function formattedId($alphabet, $size = 0, $generator = null)
    {
        $alphabet = $alphabet?:self::SAFE_SYMBOLS;
        $size = $size>0? $size: $this->size;
        $generator = $generator?:$this->generator;

        return $this->core->random($generator, $size, $alphabet);
    }

    public function formatedId($alphabet, $size = 0, GeneratorInterface $generator = null)
    {
        $size = $size>0? $size: $this->size;

        return $this->formattedId($alphabet, $size, $generator);
    }

    private function normalRandom($size)
    {
        $id = '';
        while (1 <= $size--) {
            $rand = mt_rand()/(mt_getrandmax() + 1);
            $id .= $this->alphbet[$rand*10 | 0];
        }

        return $id;
    }

  }

?>
