<?php
namespace App\Model\Form;

use Nette\Forms\Controls\BaseControl;
use Nette\Utils\Html;

class Select extends BaseControl
{
    public $name = '';
    public $options = [];
    public $class = 'default';
    public $disabled = false;
    public $disabledOptions = [];
    public $optionsEmptyMessage = 'žádné možnosti';
    
    
    function __construct ($label, $name, $options)
    {
        parent::__construct ($label);
        
        $this->name = $name;
        $this->options = $options;
    }
    
    function setDisabledOptions ($opts)
    {
        $this->disabledOptions = $opts;
    }
    
    function setOptionsEmptyMessage ($message)
    {
        $this->optionsEmptyMessage = $message;
    }
    
    function getControl()
    {
        if (empty($this->options)) {
            $this->options = ['0' => $this->optionsEmptyMessage];
            $this->disabled = true;
        }
        
        $disabled = $this->disabled ? 'data-disabled=""' : '';

        $r = '';
        $r .= '<div data-select-vlastni="" data-name="'.$this->name.'" class="'.$this->class.'" data-opened="0" '.$disabled.'>';
        $r .= Html::el('div class="sipka"')->setHtml(
            Html::el('img src="/www/vyjadreni/images/triangle.svg"')
        );
        $r .= $this->getOptions();
        $r .= '</div>';
        
        return $r;
    }
    
    function getOptions()
    {
        $r = '';
        
        foreach ($this->options as $val => $inHTML)
        {
            $first = array_key_first($this->options) === $val;
            
            if ($first) {$r .= '<div data-vybrana-moznost="">';}
            
            $selected = $this->value == $val ? 'data-selected=""' : '';
            
            $disabled = in_array($val, $this->disabledOptions) ? 'data-disabled=""' : '';
            
            $r .= '<div data-option="" data-value="'.$val.'" '.$disabled.' '.$selected.'>' .$inHTML. '</div>';
                
            if ($first) {$r .= '</div><div data-moznosti="" data-rozvinuto="0">';}
        }
        
        $r .= '</div>';
        
        return $r;
    }
}

