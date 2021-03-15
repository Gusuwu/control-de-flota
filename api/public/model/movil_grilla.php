<?php

class MovilGrilla
{
    public $table = 'Movil';
    public $fields = 'B.moviId
                    ,CONVERT(VARCHAR, B.moviModoFecha, 126) moviModoFecha
                    ,B.moviModoOdometro
                    ,CONVERT(VARCHAR, B.moviFechaAlta, 126) moviFechaAlta
                    ,B.moviBorrado
                    ,A.movilID
                    ,A.patente
                    ,A.descripcion
                    ,C.Nombre dependencia
                    ,C.OrdenamientoArbol dependenciaCompleta
                    ,A.marca
                    ,A.modelo
                    ,A.anio
                    ,A.chasis
                    ,T.Nombre tipoMovil
                    ,A.numeroMovil
                    ,A.color
                    ,A.seguro
                    ,A.poliza
                    ,A.numeroMotor
                    ,A.peso      
                    ,A.tienePatrullaje
                    ,A.CUIT'; 
    
                    public $join = "";

    public function get ($db) {
        $sql = "SELECT $this->fields FROM SISEP_ControlFlota.dbo.Movil B
                LEFT OUTER JOIN AVL_Estructura.dbo.Movil A ON B.moviId = A.MovilID
                LEFT OUTER JOIN AVL_Estructura.dbo.Comp C ON A.CompID = C.CompID
                LEFT OUTER JOIN AVL_Estructura.dbo.TipoMovil T ON T.TipoMovilID = A.TipoMovilID 
                WHERE B.moviBorrado = 0";


        $params = null;

        if (isset( $_GET["patente"])){
            $params = ["%" . $_GET["patente"] . "%"];
            $sql = $sql . " AND A.patente LIKE ? ";
        };

        $stmt = SQL::query($db, $sql, $params);
        $results = [];
        while ($row = sqlsrv_fetch_array($stmt, SQLSRV_FETCH_ASSOC)) {
            $results[] = $row;
        }

        return $results;
    }

    public function delete ($db, $id) {
        $stmt = SQL::query($db,
        "UPDATE $this->table SET moviBorrado = 1 - moviBorrado
        WHERE moviId = ?", [$id] );

        sqlsrv_fetch($stmt);
        return [];
    }

    public function post ($db) {
        $stmt = SQL::query($db,
        "INSERT INTO $this->table
        (moviId
        ,moviFechaAlta
        ,moviBorrado)
        VALUES (?,GETDATE(),0)",
        [DATA["moviId"]] );

        sqlsrv_fetch($stmt); // INSERT

        $results = DATA;
        return $results;
    }

    public function put ($db) {
       
        $stmt = SQL::query($db,
        "UPDATE $this->table
        SET moviModoOdometro = ?
            ,moviModoFecha = ?
            ,moviBorrado = ?
        WHERE moviId = ?",
        [
            DATA["moviModoOdometro"],
            DATA["moviModoFecha"],
            DATA["moviBorrado"],
            DATA["moviId"]
        ] );

        sqlsrv_fetch($stmt);
        return DATA;
    }


}

?>