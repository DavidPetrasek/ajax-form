<?php
namespace Lib\Form;


class Select
{
    private $name = '';
    private $options = [];
    private $class = '';
    private $disabled = false;
    private $disabledOptions = [];
    private $optionsEmptyMessage = 'žádné možnosti';
    private $defaultSelectedValue = '';
    
    
    function __construct ($name, $options, $class = 'default')
    {
        $this->name = $name;
        $this->options = $options;
        $this->class = $class;
    }
    
    public function setDisabledOptions ($opts)
    {
        $this->disabledOptions = $opts;
    }
    
    public function setOptionsEmptyMessage ($message)
    {
        $this->optionsEmptyMessage = $message;
    }
    
    public function setDefaultSelectedValue ($val)
    {
        $this->defaultSelectedValue = $val;
    }
    
    public function render()
    {
        if (empty($this->options))
        {
            $this->options = ['0' => $this->optionsEmptyMessage];
            $this->disabled = true;
        }
        
        $disabled = $this->disabled ? 'data-disabled' : '';
        
        $r = '<div data-select-custom data-name="'.$this->name.'" class="'.$this->class.'" data-opened="0" '.$disabled.'>';
        $r .= '<div class="sipka"><img src="/www/vyjadreni/images/triangle.svg"></div>';
        $r .= $this->getOptionsHTML();
        $r .= '</div>';
        
        return $r;
    }
    
    private function getOptionsHTML()
    {
        $r = '';
        
        if ( count($this->options) > 1  &&  empty($this->defaultSelectedValue) )
        {
            $this->defaultSelectedValue = $this->options[0];
        }
        
        foreach ($this->options as $val => $inHTML)
        {
            $first = array_key_first($this->options) === $val;
            
            if ($first) {$r .= '<div data-selected-option>';}
            
            $selected = $this->defaultSelectedValue == $val ? 'data-selected' : ''; // TODO: Not neccessary to check, because first is always selected?
            
            $disabled = in_array($val, $this->disabledOptions) ? 'data-disabled' : '';
            
            $r .= '<div data-option data-value="'.$val.'" '.$disabled.' '.$selected.'>' .$inHTML. '</div>';
            
            if ($first) {$r .= '</div><div data-options data-rozvinuto="0">';}
        }
        
        $r .= '</div>';
        
        return $r;
    }
}

?>