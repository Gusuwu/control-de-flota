<?php

class Movil
{
    public $table = 'Movil';
    public $fields = 'moviId
                ,CONVERT(VARCHAR, moviModoFecha, 126) moviModoFecha
                ,moviModoOdometro
                ,CONVERT(VARCHAR, moviFechaAlta, 126) moviFechaAlta
                ,moviBorrado'; 

    public $join = "INNER JOIN AVL_Estructura.dbo.Movil as AVLMOVIL ON Movil.moviId = AVLMOVIL.MovilID ";
    
    public function get ($db) {
        $sql = "SELECT $this->fields FROM $this->table
                $this->join
                WHERE moviBorrado = 0";

        $stmt = SQL::query($db, $sql, null);
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
        (moviModoFecha
        ,moviModoOdometro
        ,moviFechaAlta
        ,moviBorrado)
        VALUES (?,?,GETDATE(),0);

        SELECT @@IDENTITY moviId, CONVERT(VARCHAR, GETDATE(), 126) moviFechaAlta;",
        [DATA["moviModoFecha"], DATA["moviModoFecha"]] );

        sqlsrv_fetch($stmt); // INSERT
        sqlsrv_next_result($stmt);// SELECT @@IDENTITY
        $row = sqlsrv_fetch_array($stmt, SQLSRV_FETCH_ASSOC);

        $results = DATA;
        $results["moviId"] = $row["moviId"];
        $results["moviFechaAlta"] = $row["moviFechaAlta"];
        $results["moviBorrado"] = 0;
        return $results;
    }

    public function put ($db) {
        $stmt = SQL::query($db,
        "UPDATE $this->table
        SET moviModoFecha = ?
            ,moviModoOdometro = ?
        WHERE moviId = ?",
        [
            DATA["moviModoFecha"],
            DATA["moviModoOdometro"],
            DATA["moviId"]
        ] );

        sqlsrv_fetch($stmt);
        return DATA;
    }


}

?>