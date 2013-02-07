function randomFunctionalColor() {
    var colors = ['#E5ECFF','#EBE5FF','#F8E5FF','#FFE5F9','#FFE5EC','#FFEBE5',
            '#FFF8E5','#F9FFE5','#ECFFE5','#E5FFEB','#E5FFF8','#E5F9FF',
            '#A8BFFF','#6B93FF','#FFE8A8','#FFD86B', '#CCD9FF','#D9CCFF',
            '#F2CCFF','#FFCCF2','#FFCCD9','#FFD9CC','#FFF2CC','#F2FFCC',
            '#D9FFCC','#CCFFD9','#CCFFF2','#CCF2FF','#8FABFF','#527DFF',
            '#FFE38F','#FFD452','#B3C7FF','#C4B3FF','#EBB3FF','#FFB3ED',
            '#FFB3C7','#FFC4B3','#FFEBB3','#EDFFB3','#C7FFB3','#B3FFC4',
            '#B3FFEB','#B3EDFF','#759AFF','#386DFF','#FFDA75','#FFCA38']
    return colors[Math.floor(Math.random()*(colors.length + 1))]
}


function randomUserColor() {
    var colors = ['#99B4FF','#B199FF','#E499FF','#FF99E7','#FF99B4','#FFB199',
            '#FFE499','#E7FF99','#B4FF99','#99FFB1','#99FFE4','#99E7FF',
            '#5C87FF','#1F5AFF','#FFD35C','#FFC31F', '#80A2FF','#9D80FF',
            '#DD80FF','#FF80E1','#FF80A2','#FF9D80','#FFDD80','#E1FF80',
            '#A2FF80','#80FF9D','#80FFDD','#80E1FF','#4275FF','#0548FF',
            '#FFCD42','#FFBC05', '#668FFF','#8A66FF','#D666FF','#FF66DB',
            '#FF668F','#FF8A66','#FFD666','#DBFF66','#8FFF66','#66FF8A',
            '#66FFD6','#66DBFF','#2962FF','#003FEB','#FFC629','#EBAC00']
    return colors[Math.floor(Math.random()*(colors.length + 1))]
}