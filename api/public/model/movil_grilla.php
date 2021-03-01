<?php

class MovilGrilla
{
    public $table = 'Movil';
    public $fields = 'moviId
                    ,CONVERT(VARCHAR, moviModoFecha, 126) moviModoFecha
                    ,moviModoOdometro
                    ,CONVERT(VARCHAR, moviFechaAlta, 126) moviFechaAlta
                    ,moviBorrado
                   '; 
    
                    public $join = "";

    public function get ($db) {
        $sql = "SELECT $this->fields FROM $this->table
                $this->join
                WHERE moviBorrado = 0";


        $params = null;

        $stmt = SQL::query($db, $sql, $params);
        $results = [];
        while ($row = sqlsrv_fetch_array($stmt, SQLSRV_FETCH_ASSOC)) {
            $results[] = $row;
        }

        return $results;
    }

    public function delete ($db, $id) {
        $stmt = SQL::query($db,
        "UPDATE $this->table SET moviBorrado = 1
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
        // TODO
        return;
        
        $stmt = SQL::query($db,
        "UPDATE $this->table
        SET moviNombre = ?
            ,moviDescripcion = ?
        WHERE moviId = ?",
        [
            DATA["moviNombre"],
            DATA["moviDescripcion"],
            DATA["moviId"]
        ] );

        sqlsrv_fetch($stmt);
        return DATA;
    }


}

?>