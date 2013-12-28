function randomColor() {
    var colors = ['#99B4FF','#B199FF','#E499FF','#FF99E7','#FF99B4','#FFB199',
            '#99FFB1','#99FFE4','#99E7FF',
            '#FFD35C','#FFC31F', '#80A2FF','#9D80FF',
            '#DD80FF','#FF80E1','#FF80A2','#FF9D80','#FFDD80',
            '#A2FF80','#80FF9D','#80FFDD','#80E1FF',
            '#FFCD42','#FFBC05', '#D666FF','#FF66DB',
            '#FF668F','#FF8A66','#FFD666', '#8FFF66','#66FF8A',
            '#66FFD6','#66DBFF']
    return colors[Math.floor(Math.random()*colors.length)]
}
