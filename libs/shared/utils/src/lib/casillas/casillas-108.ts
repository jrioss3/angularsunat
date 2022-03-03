export class Casilla108 {
    static obtenerNumeroCasilla(id: string, tipo: string): number {
        const listaCasillasPerdidas = [
            { Val: '2002', desc: 881 },
            { Val: '2003', desc: 882 },
            { Val: '2004', desc: 883 },
            { Val: '2005', desc: 884 },
            { Val: '2006', desc: 889 },
            { Val: '2007', desc: 891 },
            { Val: '2008', desc: 893 },
            { Val: '2009', desc: 896 },
            { Val: '2010', desc: 898 },
            { Val: '2011', desc: 861 },
            { Val: '2012', desc: 863 },
            { Val: '2013', desc: 865 },
            { Val: '2014', desc: 867 },
            { Val: '2015', desc: 833 },
            { Val: '2016', desc: 835 },
            { Val: '2017', desc: 837 },
            { Val: '2018', desc: 841 },
            { Val: '2019', desc: 845 },
            { Val: '2020', desc: 853 },
            { Val: '2021', desc: 855 },
            { Val: '2022', desc: 857 },
            { Val: '2023', desc: 641 },
            { Val: '2024', desc: 643 },
            { Val: '2025', desc: 645 }];

        const listaCasillasCompensación = [
            { Val: '2002', desc: 885 },
            { Val: '2003', desc: 886 },
            { Val: '2004', desc: 887 },
            { Val: '2005', desc: 888 },
            { Val: '2006', desc: 890 },
            { Val: '2007', desc: 892 },
            { Val: '2008', desc: 894 },
            { Val: '2009', desc: 897 },
            { Val: '2010', desc: 899 },
            { Val: '2011', desc: 862 },
            { Val: '2012', desc: 864 },
            { Val: '2013', desc: 866 },
            { Val: '2014', desc: 868 },
            { Val: '2015', desc: 834 },
            { Val: '2016', desc: 836 },
            { Val: '2017', desc: 838 },
            { Val: '2018', desc: 842 },
            { Val: '2019', desc: 846 },
            { Val: '2020', desc: 854 },
            { Val: '2021', desc: 856 },
            { Val: '2022', desc: 858 },
            { Val: '2023', desc: 642 },
            { Val: '2024', desc: 644 },
            { Val: '2025', desc: 646 }];

        let numeroCasilla = [];
        if (tipo.toString() === '1') {
            numeroCasilla = listaCasillasPerdidas.filter(x => x.Val === id);
        } else {
            numeroCasilla = listaCasillasCompensación.filter(x => x.Val === id);
        }
        return numeroCasilla[0].desc;
    }
}